import mongoose from 'mongoose';
import net from 'net';

let isMongoConnected = false;

/**
 * Check if a TCP port is open and accepting connections
 */
const checkPortReachability = (host: string, port: number, timeoutMs = 600): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(true);
      }
    });

    socket.on('timeout', () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.on('error', () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(false);
      }
    });

    try {
      socket.connect(port, host);
    } catch {
      resolve(false);
    }
  });
};

export const connectDB = async (): Promise<boolean> => {
  let uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : '';

  if (!uri) {
    console.log('ℹ️ MONGODB_URI not provided. Running in resilient local storage mode.');
    isMongoConnected = false;
    return false;
  }

  // Sanitize angle brackets often accidentally copied from MongoDB Atlas templates (e.g. <username>)
  uri = uri.replace(/<([^>]+)>/g, '$1').replace(/[<>]/g, '').trim();

  // Detect if the URI points to local loopback (localhost or 127.0.0.1)
  const isLocalhost = uri.includes('localhost') || uri.includes('127.0.0.1') || uri.includes('0.0.0.0');

  if (isLocalhost) {
    // Extract port if specified, default to 27017
    const portMatch = uri.match(/:(\d+)/);
    const port = portMatch ? parseInt(portMatch[1], 10) : 27017;
    const host = uri.includes('127.0.0.1') ? '127.0.0.1' : 'localhost';

    const reachable = await checkPortReachability(host, port, 600);
    if (!reachable) {
      console.log(`ℹ️ Local MongoDB daemon not active on ${host}:${port}. Using persistent local repository.`);
      isMongoConnected = false;
      return false;
    }
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500,
    });
    isMongoConnected = true;
    console.log('✅ MongoDB connected successfully to database.');
    return true;
  } catch (error: any) {
    const isAtlas = uri.includes('mongodb+srv://') || uri.includes('mongodb.net');
    if (isAtlas) {
      console.log('ℹ️ MongoDB Atlas unreachable (ensure 0.0.0.0/0 IP access is allowed in Atlas Network Access). Using persistent local repository.');
    } else {
      console.log('ℹ️ MongoDB connection not available. Using resilient local repository fallback.');
    }
    isMongoConnected = false;
    return false;
  }
};

export const getDBStatus = () => ({
  isConnected: isMongoConnected && mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  mode: isMongoConnected && mongoose.connection.readyState === 1 ? 'mongodb' : 'memory-fallback',
});
