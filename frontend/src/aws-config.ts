/**
 * Frontend configuration for AWS S3 and CloudFront deployment
 * Generated for GOSH Project
 */

export const awsConfig = {
  // S3 bucket for frontend assets
  s3Bucket: 'http://gosh-static-webstite-bucket.s3-website-us-east-1.amazonaws.com',
  
  // CloudFront distribution domain
  cloudFrontDomain: 'd2l1zjbdxeq7mh.cloudfront.net',
  
  // API Gateway endpoint for backend Lambda
  apiEndpoint:'https://yoe7524zbi.execute-api.us-east-1.amazonaws.com',
  
  // S3 uploads bucket for direct uploads
  uploadsBucket:'gosh-file-bucket',
  
  // AWS region
  awsRegion: 'us-east-1',
};

/**
 * Get the appropriate URL for an API endpoint
 * Routes through CloudFront which uses origin behavior to direct to Lambda
 */
export function getApiUrl(path: string): string {
  // Validate CloudFront domain is not a placeholder
  const isValidCloudFront = awsConfig.cloudFrontDomain && 
    !awsConfig.cloudFrontDomain.includes('d12345') && 
    awsConfig.cloudFrontDomain.length > 0;
  
  if (isValidCloudFront) {
    // Use CloudFront as entry point - origin behavior routes /api/* to Lambda
    return `https://${awsConfig.cloudFrontDomain}${path}`;
  }
  
  // Fall back to direct API Gateway endpoint if CloudFront not configured
  return `${awsConfig.apiEndpoint}${path}`;
}

/**
 * Get CloudFront URL for homepage cards and images
 * Uses /homepage-cards/* path pattern routed to S3 by CloudFront
 */
export function getHomepageCardsUrl(path: string): string {
  // Validate CloudFront domain is not a placeholder
  const isValidCloudFront = awsConfig.cloudFrontDomain && 
    !awsConfig.cloudFrontDomain.includes('d12345') && 
    awsConfig.cloudFrontDomain.length > 0;
  
  if (isValidCloudFront) {
    // Use CloudFront entry point with /homepage-cards/* prefix
    // CloudFront origin behavior routes this to S3
    return `https://${awsConfig.cloudFrontDomain}/homepage-cards${path}`;
  }
  
  // Fall back to direct S3 URL if CloudFront not configured
  return `https://${awsConfig.uploadsBucket}.s3.${awsConfig.awsRegion}.amazonaws.com/${path}`;
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
    return `https://${awsConfig.cloudFrontDomain}/homepage-cards/${key}`;
  }
  
  // Fall back to direct S3 URL
  return `https://${awsConfig.uploadsBucket}.s3.${awsConfig.awsRegion}.amazonaws.com/${key}`;
}
