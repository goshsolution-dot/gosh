/**
 * Frontend configuration for AWS S3 and CloudFront deployment
 * Generated for GOSH Project
 */

export const awsConfig = {
  // S3 bucket for frontend assets
  s3Bucket: import.meta.env.REACT_APP_FRONTEND_BUCKET_NAME || 'gosh-frontend',
  
  // CloudFront distribution domain
  cloudFrontDomain: import.meta.env.REACT_APP_CLOUDFRONT_DOMAIN || null,
  
  // API Gateway endpoint for backend Lambda
  apiEndpoint: import.meta.env.REACT_APP_API_ENDPOINT || 'https://yoe7524zbi.execute-api.us-east-1.amazonaws.com',
  
  // S3 uploads bucket for direct uploads
  uploadsBucket: import.meta.env.REACT_APP_UPLOADS_BUCKET_NAME || 'gosh-file-bucket',
  
  // AWS region
  awsRegion: import.meta.env.REACT_APP_AWS_REGION || 'us-east-1',
};

/**
 * Get the appropriate URL for an API endpoint
 */
export function getApiUrl(path: string): string {
  return `${awsConfig.apiEndpoint}${path}`;
}

/**
 * Get S3 file URL (from uploads bucket)
 * Prefers CloudFront if configured, otherwise uses direct S3 URL
 */
export function getS3FileUrl(key: string): string {
  // Validate CloudFront domain is not a placeholder
  const isValidCloudFront = awsConfig.cloudFrontDomain && 
    !awsConfig.cloudFrontDomain.includes('d12345') && 
    awsConfig.cloudFrontDomain.length > 0;
  
  if (isValidCloudFront) {
    return `https://${awsConfig.cloudFrontDomain}/${key}`;
  }
  
  // Fall back to direct S3 URL
  return `https://${awsConfig.uploadsBucket}.s3.${awsConfig.awsRegion}.amazonaws.com/${key}`;
}
