import express, { Application, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './config/database';
import eventRoutes from './routes/event.routes';
import attendeeRoutes from './routes/attendee.routes';
import { MulterError } from 'multer';

dotenv.config();

class App {
  public app: Application;
  public port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '5000');

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'Event Manager API is running',
        timestamp: new Date().toISOString()
      });
    });

    // API routes
    this.app.use('/events', eventRoutes);
    this.app.use('/attendees', attendeeRoutes);

    // 404 handler for undefined routes
    this.app.use('*', (res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(
      (err: unknown, res: Response,) => {
        console.error('Error:', err);

        if (err instanceof MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'File too large. Maximum size is 5MB.',
            });
          }
        }

        if (err instanceof Error) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        return res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    );
  }

  private async initializeDatabase(): Promise<void> {
    await database.connect();
  }

  public async closeDatabaseConnection(): Promise<void> {
    await database.disconnect();
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server is running on port ${this.port}`);
      console.log(`📝 API Documentation available at http://localhost:${this.port}/health`);
    });
  }
}

// Create and start the application
const app = new App();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  await app.closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  await app.closeDatabaseConnection();
  process.exit(0);
});

// Start server
app.listen();

export default app;