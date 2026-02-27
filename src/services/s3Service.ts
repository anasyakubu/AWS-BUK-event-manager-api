import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import s3Config from '../config/s3';

class S3Service {
  private s3: S3;
  private bucketName: string;

  constructor() {
    this.s3 = s3Config.getS3();
    this.bucketName = s3Config.getBucketName();
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'events'): Promise<{ url: string; key: string }> {
    try {
      const key = `${folder}/${uuidv4()}-${file.originalname}`;

      const params: S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      const result = await this.s3.upload(params).promise();

      return {
        url: result.Location,
        key: result.Key,
      };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const params: S3.DeleteObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }

  async getFileUrl(key: string): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Expires: 3600, // URL expires in 1 hour
      };

      return this.s3.getSignedUrl('getObject', params);
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate file URL');
    }
  }
}

export default new S3Service();