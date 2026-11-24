const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hub_learning';
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

  try {
    // Use a longer timeout for cloud deployments (Atlas + Render cold starts)
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isProduction ? 30000 : 1500,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`[Database] MongoDB Connected successfully to: ${uri.replace(/\/\/.*@/, '//***@')}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB URI: ${err.message}`);

    if (isProduction) {
      console.error('====================================================');
      console.error('❌ FATAL: Production environment cannot fall back to temporary in-memory database.');
      console.error('Please configure a valid, reachable MONGODB_URI in your environment variables.');
      console.error('====================================================');
      process.exit(1);
    }

    console.log('[Database] Initializing persistent local MongoDB storage for local zero-config operation...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbDir = path.join(__dirname, '..', '.mongodb_data');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbPath: dbDir,
          storageEngine: 'wiredTiger',
        },
      });
      const inMemoryUri = mongodInstance.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected to Persistent Local MongoDB at: ${inMemoryUri}`);
      console.log(`[Database] Persistent database files stored in: ${dbDir}`);
      console.log('[Database] User accounts and progress will persist across server restarts.');
    } catch (memErr) {
      console.error('[Database] Failed to initialize persistent local MongoDB:', memErr.message);
      console.error('[Database] Please ensure MongoDB is running locally or provide a valid MONGODB_URI in .env');
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (error) {
    console.error('[Database] Error during disconnect:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
