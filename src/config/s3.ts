import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

class S3Config {
  private static instance: S3Config;
  private s3: AWS.S3;

  private constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
    });

    this.s3 = new AWS.S3();
  }

  public static getInstance(): S3Config {
    if (!S3Config.instance) {
      S3Config.instance = new S3Config();
    }
    return S3Config.instance;
  }

  public getS3(): AWS.S3 {
    return this.s3;
  }

  public getBucketName(): string {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME is not defined in environment variables');
    }
    return bucketName;
  }
}

export default S3Config.getInstance();