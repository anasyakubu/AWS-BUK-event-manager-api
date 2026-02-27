import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() { }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('MongoDB is already connected');
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/event_manager';

      await mongoose.connect(mongoUri,
        {
          dbName: 'aws-clubDB',
        }
      );

      this.isConnected = true;
      console.log('MongoDB connected successfully');

      mongoose.connection.on('error', (error: any) => {
        console.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }
}

export default Database.getInstance();