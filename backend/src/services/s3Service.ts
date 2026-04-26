import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

export class S3Service {
  private bucket = (process.env.UPLOADS_BUCKET_NAME || 'gosh-file-bucket').trim();

  /**
   * Upload a file to S3
   * @param key - S3 object key (path)
   * @param body - File content (Buffer or string)
   * @param contentType - MIME type
   */
  async uploadFile(key: string, body: Buffer | string, contentType: string = 'application/octet-stream'): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      });

      await s3Client.send(command);
      
      // Return the S3 object URL
      return `https://${this.bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
    } catch (error) {
      console.error(`[S3] Upload failed for ${key}:`, error);
      throw new Error(`Failed to upload file to S3: ${error}`);
    }
  }

  /**
   * Generate a presigned URL for uploading files from frontend
   * @param key - S3 object key
   * @param contentType - MIME type
   * @param expiresIn - URL expiration time in seconds (default: 1 hour)
   */
  async generatePresignedUploadUrl(key: string, contentType: string = 'application/octet-stream', expiresIn: number = 3600): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      console.error(`[S3] Failed to generate presigned upload URL for ${key}:`, error);
      throw new Error(`Failed to generate presigned URL: ${error}`);
    }
  }

  /**
   * Generate a presigned URL for downloading files from frontend
   * @param key - S3 object key
   * @param expiresIn - URL expiration time in seconds (default: 1 hour)
   */
  async generatePresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      console.error(`[S3] Failed to generate presigned download URL for ${key}:`, error);
      throw new Error(`Failed to generate presigned URL: ${error}`);
    }
  }

  /**
   * Delete a file from S3
   * @param key - S3 object key
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await s3Client.send(command);
      console.log(`[S3] Deleted: ${key}`);
    } catch (error) {
      console.error(`[S3] Delete failed for ${key}:`, error);
      throw new Error(`Failed to delete file from S3: ${error}`);
    }
  }

  /**
   * Upload a local file from disk to S3
   * @param localPath - Local file path
   * @param s3Key - S3 object key
   */
  async uploadFileFromDisk(localPath: string, s3Key: string): Promise<string> {
    try {
      const fileContent = fs.readFileSync(localPath);
      const contentType = this.getMimeType(localPath);
      return await this.uploadFile(s3Key, fileContent, contentType);
    } catch (error) {
      console.error(`[S3] Failed to upload file from disk ${localPath}:`, error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  /**
   * Get MIME type based on file extension
   */
  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}

export default new S3Service();
