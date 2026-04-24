#!/bin/bash

# GOSH Project AWS Deployment Script
# This script deploys the backend to AWS Lambda and frontend to S3

set -e

echo "========================================="
echo "GOSH Project - AWS Deployment"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check environment
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please copy .env.aws.example to .env and configure your AWS settings"
    exit 1
fi

echo -e "${YELLOW}Loading environment variables...${NC}"
source .env

# Deploy Backend (Lambda)
if [ "$DEPLOY_BACKEND" = true ]; then
    echo -e "${YELLOW}Deploying Backend to AWS Lambda...${NC}"
    cd backend
    
    npm run build:lambda
    serverless deploy --stage $STAGE --region $AWS_REGION
    
    echo -e "${GREEN}Backend deployment complete!${NC}"
    cd ..
else
    echo -e "${YELLOW}Skipping backend deployment${NC}"
fi

# Deploy Frontend (S3)
if [ "$DEPLOY_FRONTEND" = true ]; then
    echo -e "${YELLOW}Building and deploying Frontend to S3...${NC}"
    cd frontend
    
    npm run build
    
    # Upload to S3
    aws s3 sync dist/ s3://$FRONTEND_BUCKET_NAME \
        --region $AWS_REGION \
        --delete \
        --cache-control "public, max-age=3600"
    
    # Upload index.html with no cache
    aws s3 cp dist/index.html s3://$FRONTEND_BUCKET_NAME/index.html \
        --region $AWS_REGION \
        --content-type "text/html" \
        --cache-control "no-cache, no-store, must-revalidate"
    
    echo -e "${GREEN}Frontend deployment complete!${NC}"
    
    # Invalidate CloudFront cache if distribution ID is set
    if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        echo -e "${YELLOW}Invalidating CloudFront cache...${NC}"
        aws cloudfront create-invalidation \
            --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
            --paths "/*" \
            --region $AWS_REGION
        echo -e "${GREEN}CloudFront invalidation complete!${NC}"
    fi
    
    cd ..
else
    echo -e "${YELLOW}Skipping frontend deployment${NC}"
fi

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
