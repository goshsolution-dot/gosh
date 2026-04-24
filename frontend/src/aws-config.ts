/**
 * Frontend configuration for AWS S3 and CloudFront deployment
 * Generated for GOSH Project
 */

export const awsConfig = {
  // S3 bucket for frontend assets
  s3Bucket: process.env.REACT_APP_FRONTEND_BUCKET_NAME || 'gosh-frontend',
  
  // CloudFront distribution domain
  cloudFrontDomain: process.env.REACT_APP_CLOUDFRONT_DOMAIN || null,
  
  // API Gateway endpoint for backend Lambda
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.gosh.local/api',
  
  // S3 uploads bucket for direct uploads
  uploadsBucket: process.env.REACT_APP_UPLOADS_BUCKET_NAME || 'gosh-uploads',
  
  // AWS region
  awsRegion: process.env.REACT_APP_AWS_REGION || 'us-east-1',
};

/**
 * Get the appropriate URL for an API endpoint
 */
export function getApiUrl(path: string): string {
  return `${awsConfig.apiEndpoint}${path}`;
}

/**
 * Get S3 file URL (from uploads bucket)
 */
export function getS3FileUrl(key: string): string {
  if (awsConfig.cloudFrontDomain) {
    return `https://${awsConfig.cloudFrontDomain}/${key}`;
  }
  return `https://${awsConfig.uploadsBucket}.s3.${awsConfig.awsRegion}.amazonaws.com/${key}`;
}
