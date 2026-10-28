import mongoose from 'mongoose';

export interface DatabaseStatus {
  connected: boolean;
  type: 'atlas' | 'in-memory' | 'disconnected';
  uriConfigured: boolean;
  host?: string;
  databaseName?: string;
  error?: string | null;
  modelsReady: boolean;
}

export const dbStatus: DatabaseStatus = {
  connected: false,
  type: 'disconnected',
  uriConfigured: false,
  error: null,
  modelsReady: false,
};

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '' && !uri.includes('<username>') && !uri.includes('MY_MONGODB_URI')) {
    dbStatus.uriConfigured = true;
    try {
      console.log('Connecting to MongoDB Atlas at configured URI...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      dbStatus.connected = true;
      dbStatus.type = 'atlas';
      dbStatus.host = mongoose.connection.host;
      dbStatus.databaseName = mongoose.connection.name;
      dbStatus.error = null;
      dbStatus.modelsReady = true;

      console.log(`[MongoDB] Successfully connected to MongoDB Atlas: ${mongoose.connection.host}/${mongoose.connection.name}`);
      return;
    } catch (err: any) {
      console.error('[MongoDB] Connection to Atlas failed:', err.message);
      dbStatus.connected = false;
      dbStatus.error = err.message;
    }
  } else {
    console.log('[MongoDB] Notice: MONGODB_URI is not set or contains placeholder credentials.');
    dbStatus.uriConfigured = false;
    dbStatus.error = 'MONGODB_URI not configured in environment';
  }

  // Fallback mode: Set type to in-memory to ensure zero-downtime exploration
  dbStatus.connected = true;
  dbStatus.type = 'in-memory';
  dbStatus.databaseName = 'imovies_local';
  dbStatus.modelsReady = true;
  console.log('[MongoDB] Running with built-in persistent in-memory repository. Connect your MongoDB Atlas URI anytime in .env to switch seamlessly to cloud storage.');
}

mongoose.connection.on('connected', () => {
  dbStatus.connected = true;
  dbStatus.type = 'atlas';
  dbStatus.host = mongoose.connection.host;
  dbStatus.databaseName = mongoose.connection.name;
  dbStatus.error = null;
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB Error]:', err.message);
  dbStatus.error = err.message;
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB Disconnected]');
  if (dbStatus.type === 'atlas') {
    dbStatus.connected = false;
  }
});
