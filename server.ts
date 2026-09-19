import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

import { connectDB } from "./backend/config/db";
import { initializeData } from "./backend/config/store";
import authRoutes from "./backend/routes/authRoutes";
import projectRoutes from "./backend/routes/projectRoutes";
import resumeRoutes from "./backend/routes/resumeRoutes";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "backend", ".env") });

// If VITE_API_URL is pointing to a local dev port (e.g. 5173), clear it so the client uses relative API routes
if (
  process.env.VITE_API_URL &&
  (process.env.VITE_API_URL.includes("5173") ||
    process.env.VITE_API_URL.includes("localhost"))
) {
  delete process.env.VITE_API_URL;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Production-ready CORS middleware
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const configuredClients = [
      ...new Set(
        [
          // Production frontend URL (Render deployment)
          process.env.FRONTEND_URL,
          // Legacy/alternative variable name kept for backwards compatibility
          process.env.CLIENT_URL,
          // Always allow local Vite dev server
          "http://localhost:5173",
        ]
          .filter((u): u is string => typeof u === "string")
          .flatMap((u) => u.split(","))
          .map((u) => u.trim().replace(/\/+$/, ""))
          .filter(Boolean),
      ),
    ];

    if (configuredClients.length > 0) {
      if (
        origin &&
        (configuredClients.includes(origin) || configuredClients.includes("*"))
      ) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      } else if (!origin) {
        res.setHeader(
          "Access-Control-Allow-Origin",
          configuredClients[0] || "*",
        );
      }
    } else {
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With",
    );

    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Body parser middlewares
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // Static assets from frontend/public and public folder
  app.use(express.static(path.join(process.cwd(), "frontend", "public")));
  app.use(express.static(path.join(process.cwd(), "public")));

  // Initialize DB & Data Seed
  await connectDB();
  await initializeData();

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "Sikandar Portfolio API & Private Admin",
      timestamp: new Date().toISOString(),
    });
  });

  // Authentication API
  app.use("/api/auth", authRoutes);

  // Projects API
  // Mounting both at /api/projects for public and /api for /api/admin/projects
  app.use("/api/projects", projectRoutes);
  app.use("/api", projectRoutes);

  // Resume API
  // Mounting at /api/resume for public and /api for /api/admin/resume
  app.use("/api/resume", resumeRoutes);
  app.use("/api", resumeRoutes);

  // ── Global error handler (MUST be before Vite/static fallthrough) ──
  // Multer file-filter / size-limit errors otherwise become a bare HTML 500.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (!err) return _next();
    if (err.name === "MulterError") {
      let message = "File upload failed.";
      if (err.code === "LIMIT_FILE_SIZE") {
        message = "Image file size must be less than 10MB (resume PDF less than 15MB).";
      } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        message = 'Unexpected file field. Use "image" for projects and "resume" for resume PDF.';
      }
      if (!res.headersSent) {
        return res.status(400).json({ success: false, message });
      }
      return;
    }
    if (err instanceof Error && /Invalid (image file type|file type)/.test(err.message)) {
      if (!res.headersSent) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return;
    }
    // Let Vite middleware / static handler deal with non-API errors; log API ones.
    if (req.path.startsWith("/api")) {
      console.error("Unhandled API error:", err);
      if (!res.headersSent) {
        return res.status(err?.statusCode === 400 ? 400 : 500).json({
          success: false,
          message: err?.message || "Internal server error.",
        });
      }
      return;
    }
    _next(err);
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.resolve(__dirname, "frontend"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `🚀 Portfolio & Admin Server running at http://localhost:5000${PORT}`,
    );
  });
}

startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
});
