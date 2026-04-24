#!/bin/bash

# GOSH Project - Setup AWS S3 Buckets and CloudFront
# This script creates and configures S3 buckets and CloudFront distribution

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Loading environment variables...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    exit 1
fi
source .env

# Create S3 buckets
echo -e "${YELLOW}Creating S3 buckets...${NC}"

# Frontend bucket
aws s3api create-bucket \
    --bucket $FRONTEND_BUCKET_NAME \
    --region $AWS_REGION \
    $(if [ "$AWS_REGION" != "us-east-1" ]; then echo "--create-bucket-configuration LocationConstraint=$AWS_REGION"; fi) \
    2>/dev/null || echo "Frontend bucket already exists"

# Uploads bucket
aws s3api create-bucket \
    --bucket $UPLOADS_BUCKET_NAME \
    --region $AWS_REGION \
    $(if [ "$AWS_REGION" != "us-east-1" ]; then echo "--create-bucket-configuration LocationConstraint=$AWS_REGION"; fi) \
    2>/dev/null || echo "Uploads bucket already exists"

# Enable versioning on uploads bucket
aws s3api put-bucket-versioning \
    --bucket $UPLOADS_BUCKET_NAME \
    --versioning-configuration Status=Enabled \
    --region $AWS_REGION

# Configure frontend bucket for static website hosting
echo -e "${YELLOW}Configuring frontend bucket for static website hosting...${NC}"
aws s3api put-bucket-website \
    --bucket $FRONTEND_BUCKET_NAME \
    --website-configuration file:///dev/stdin <<EOF
{
  "IndexDocument": {
    "Suffix": "index.html"
  },
  "ErrorDocument": {
    "Key": "index.html"
  }
}
EOF

# Block public access but allow CloudFront
aws s3api put-public-access-block \
    --bucket $FRONTEND_BUCKET_NAME \
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
    --region $AWS_REGION

# Uploads bucket - block all public access (files accessed via presigned URLs)
aws s3api put-public-access-block \
    --bucket $UPLOADS_BUCKET_NAME \
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    --region $AWS_REGION

echo -e "${GREEN}S3 buckets configured successfully!${NC}"
echo -e "${YELLOW}Next: Create CloudFront distribution manually or update terraform/CDK scripts${NC}"
