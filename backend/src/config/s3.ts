/**
 * AWS S3 Configuration
 * Stores upload endpoints and bucket information
 */

export const s3Config = {
  // Main uploads bucket for user-uploaded files
  uploadsBucket: process.env.UPLOADS_BUCKET_NAME || 'gosh-uploads',
  
  // Frontend assets bucket (for SPA hosting)
  frontendBucket: process.env.FRONTEND_BUCKET_NAME || 'gosh-frontend',
  
  // AWS region
  region: process.env.AWS_REGION || 'us-east-1',
  
  // CloudFront distribution domain (optional, for CDN)
  cloudFrontDomain: process.env.CLOUDFRONT_DOMAIN || null,
};

/**
 * Get the appropriate URL for files based on configuration
 */
export function getFileUrl(bucket: string, key: string): string {
  if (s3Config.cloudFrontDomain) {
    return `https://${s3Config.cloudFrontDomain}/${key}`;
  }
  return `https://${bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;
}
