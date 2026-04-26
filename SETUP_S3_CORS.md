# S3 CORS Configuration - AWS CLI Commands

## One-Command CORS Setup

### Option 1: Using jq (Recommended if installed)
```bash
# Update these values:
BUCKET_NAME="gosh-file-bucket"
API_ENDPOINT="https://yoe7524zbi.execute-api.us-east-1.amazonaws.com"
CLOUDFRONT_DOMAIN="d12345.cloudfront.net"

# Run this command
aws s3api put-bucket-cors \
  --bucket "$BUCKET_NAME" \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "HEAD", "DELETE"],
        "AllowedOrigins": [
          "'$API_ENDPOINT'",
          "'$CLOUDFRONT_DOMAIN'",
          "http://localhost:5173",
          "http://localhost:3000"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
      }
    ]
  }'
```

### Option 2: Using File (No Dependencies)
```bash
# Step 1: Create cors-config.json
cat > cors-config.json << 'EOF'
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD", "DELETE"],
      "AllowedOrigins": [
        "https://yoe7524zbi.execute-api.us-east-1.amazonaws.com",
        "https://d12345.cloudfront.net",
        "http://localhost:5173",
        "http://localhost:3000"
      ],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

# Step 2: Apply to bucket
aws s3api put-bucket-cors \
  --bucket gosh-file-bucket \
  --cors-configuration file://cors-config.json

# Step 3: Verify it worked
aws s3api get-bucket-cors --bucket gosh-file-bucket
```

### Option 3: Using AWS Console (No CLI)
1. Go to AWS Console → S3
2. Click `gosh-file-bucket`
3. Go to Permissions tab
4. Scroll down to CORS
5. Click Edit
6. Paste this JSON:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD", "DELETE"],
    "AllowedOrigins": [
      "https://yoe7524zbi.execute-api.us-east-1.amazonaws.com",
      "https://d12345.cloudfront.net",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```
7. Click Save

## Verify CORS is Working

```bash
# Check that CORS is configured
aws s3api get-bucket-cors --bucket gosh-file-bucket

# Expected output should include your rules
```

## Troubleshooting

### Error: "Profile not found"
```bash
# Set your AWS credentials
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1

# Then run the command again
```

### Error: "NoSuchBucket"
```bash
# Check bucket exists and name is correct
aws s3 ls | grep gosh-file-bucket

# If not found, verify bucket name in your .env
```

### Error: "AccessDenied"
```bash
# Your AWS credentials don't have permission to modify bucket CORS
# Need S3:PutBucketCors permission
# Check IAM user/role has this policy:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutBucketCors",
        "s3:GetBucketCors"
      ],
      "Resource": "arn:aws:s3:::gosh-file-bucket"
    }
  ]
}
```

## Important Notes

### AllowedOrigins
Update these to match your actual domains:
- `https://yoe7524zbi.execute-api.us-east-1.amazonaws.com` - Your API Gateway endpoint
- `https://d12345.cloudfront.net` - Your CloudFront domain (if you have one)
- `http://localhost:5173` - Local development (Vite frontend)
- `http://localhost:3000` - Local development (if using different port)

### AllowedMethods
These are required for image upload:
- `PUT` - Upload files
- `POST` - Alternative upload
- `GET` - Download/preview
- `HEAD` - Check existence
- `DELETE` - Remove files

### MaxAgeSeconds
- `3000` - 50 minutes cache
- Increase to cache CORS preflight longer
- Decrease if you change origins frequently

## After CORS is Configured

1. Rebuild frontend: `npm run build` (from frontend/)
2. Deploy backend (if not already deployed)
3. Test image upload on admin dashboard
4. Check browser DevTools Console for [S3] logs

## Quick Test

To verify CORS is working without uploading:
```bash
# This should return your CORS rules
curl -I -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: PUT" \
  https://gosh-file-bucket.s3.us-east-1.amazonaws.com/

# Look for "Access-Control-Allow-Origin" in response
```

---

**IMPORTANT:** After running the CORS command, you MUST rebuild and redeploy your frontend for changes to take effect!

```bash
cd frontend
npm run build
# Then deploy (S3 sync, CloudFront, etc.)
```
