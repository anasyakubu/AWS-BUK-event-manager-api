import multer from 'multer';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

class UploadMiddleware {
  private upload: multer.Multer;

  constructor() {
    const storage = multer.memoryStorage();

    const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      console.log(req);
      const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp')
        .split(',');

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'));
      }
    };

    this.upload = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
      },
    });
  }

  public getUploadMiddleware() {
    return this.upload;
  }

  public singleFile(fieldName: string) {
    return this.upload.single(fieldName);
  }

  public multipleFiles(fieldName: string, maxCount: number = 5) {
    return this.upload.array(fieldName, maxCount);
  }
}

export default new UploadMiddleware();