# 🚀 Sikandar - MERN Stack Developer Portfolio & Admin CMS

A high-performance, responsive full-stack portfolio and private admin content management system built with **React 19**, **Node.js**, **Express**, **MongoDB Atlas / Persistent Store Fallback**, and **Cloudinary**.

---

## 📁 Project Architecture & Restructured Directory Layout

```
portfolio/
│
├── frontend/                     # Modern React + Vite Single Page Application
│   ├── src/
│   │   ├── api/                  # Axios HTTP client with JWT interceptors
│   │   ├── assets/               # Static icons, logos, and illustrations
│   │   ├── components/           # Reusable UI components & sections
│   │   │   └── admin/            # Admin forms, table modals, and sidebar
│   │   ├── context/              # Toast & Auth global contexts
│   │   ├── data/                 # Portfolio static fallback content
│   │   ├── hooks/                # Custom React hooks (e.g. useScrollPosition)
│   │   ├── pages/                # Public pages & private Admin Dashboard pages
│   │   │   └── admin/            # Dashboard, Project CRUD, Resume Manager
│   │   ├── utils/                # Date formatters, string & color helpers
│   │   ├── App.tsx               # Client routes & protected routes
│   │   ├── index.css             # Tailwind CSS styles & modern glow utilities
│   │   ├── main.tsx              # React DOM entrypoint
│   │   └── types.ts              # TypeScript interfaces
│   ├── public/                   # Public assets (resume.pdf, favicon, etc.)
│   ├── index.html                # HTML entry point with Google Fonts
│   ├── package.json              # Frontend dependencies and Vite scripts
│   ├── vite.config.ts            # Vite config with proxy to backend
│   ├── .env.example              # Frontend environment variables template
│   └── .env                      # Frontend local environment
│
├── backend/                      # Node.js & Express RESTful API Server
│   ├── config/                   # Database (MongoDB), Cloudinary & Store config
│   │   ├── db.ts                 # MongoDB Atlas connector & connection detection
│   │   ├── cloudinary.ts         # Cloudinary SDK for images & resume uploads
│   │   └── store.ts              # Local disk JSON persistence + MongoDB sync
│   ├── controllers/              # Request handlers (Projects, Resume, Auth)
│   ├── data/
│   │   └── store.json            # Disk JSON database for reliable fallback
│   ├── middleware/
│   │   └── authMiddleware.ts     # JWT verification middleware for admin routes
│   ├── models/                   # Mongoose schemas (Project, Resume, Admin)
│   ├── routes/                   # Express routes (authRoutes, projectRoutes, resumeRoutes)
│   ├── scripts/                  # Admin initialization & database seeding
│   ├── services/                 # Business logic service layer
│   │   ├── authService.ts        # Authentication & admin lookup services
│   │   ├── projectService.ts     # Project CRUD business logic
│   │   └── resumeService.ts      # Resume storage & retrieval services
│   ├── server.ts                 # Standalone Express server (Port 5000 default)
│   ├── package.json              # Backend dependencies and server scripts
│   ├── .env.example              # Backend environment variables template
│   └── .env                      # Backend local environment
│
├── .gitignore                    # Ignored directories, env files & logs
├── package.json                  # Monorepo / Unified orchestrator
├── server.ts                     # Unified Express + Vite development bridge
└── README.md                     # Comprehensive documentation & run guide
```

---

## ⚡ How to Run the Project

You can run the project in either **Unified Mode** (both frontend and backend served together) or **Separate Mode** (frontend and backend running independently on separate ports).

### Option 1: Unified Mode (Recommended for Single-Port / AI Studio)

Both the backend API and frontend Vite app run together on **port 3000**:

```bash
# 1. Install dependencies at the root
npm install

# 2. Run the unified dev server
npm run dev

# 3. Create or seed the admin user
npm run create-admin
```
- Open in browser: `http://localhost:3000`
- API Health Check: `http://localhost:3000/api/health`

---

### Option 2: Run Frontend and Backend Separately

#### Step 1: Start the Backend (Port 5000)
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install backend dependencies
npm install

# 3. Setup backend environment variables
cp .env.example .env

# 4. Start the backend server
npm run dev
# (or: tsx server.ts)
```
- Backend API runs at: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

#### Step 2: Start the Frontend (Port 5173)
```bash
# 1. In a new terminal window, navigate to frontend directory
cd frontend

# 2. Install frontend dependencies
npm install

# 3. Setup frontend environment variables
cp .env.example .env

# 4. Start the Vite dev server
npm run dev
```
- Frontend application runs at: `http://localhost:5173`
- Requests to `/api/*` are automatically proxied to `http://localhost:5000`.

---

## 🔐 Admin Dashboard Access

To access the private Admin Panel:
- **URL**: Navigate to `/admin/login` (e.g., `http://localhost:3000/admin/login` or `http://localhost:5173/admin/login`)
- Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your secure `.env` file.

To create or seed an admin user at any time:
```bash
npm run create-admin
# or in the backend folder:
cd backend && npm run create-admin
```

---

## 🗄️ Database & Resilient Storage Architecture

1. **MongoDB Atlas Mode**:
   - Provide your MongoDB Atlas connection string in your `.env` file:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```
   - In MongoDB Atlas, configure network access by whitelisting your server IP under **Network Access**.
2. **Resilient Local JSON Fallback**:
   - If MongoDB Atlas is not configured or is unreachable, the server automatically falls back to `backend/data/store.json`.
   - All Project CRUD operations (add, edit, toggle published/featured, delete), resume uploads, and admin credentials persist safely.

---

## 📄 Resume Download & Cloudinary Upload

- **Public Download**: When recruiters click **"Download Resume"**, the backend serves the file directly from `/api/resume/download` with content disposition headers, ensuring proper download behavior across all browsers.
- **Admin Upload**: Uploading a new PDF in `/admin/resume` automatically deploys the document to Cloudinary (or stores it locally) and updates the download link in real time.
