# S3 CORS Configuration for Image Upload

## Issue
The image upload to S3 was failing because:
1. Frontend was converting images to base64 instead of uploading to S3
2. S3 bucket may not have CORS policy configured

## Solution Implemented

### Frontend Changes
✅ Modified `AdminDashboardPage.tsx` to:
- Upload images directly to S3 using presigned URLs
- Show upload progress and errors
- Make images optional (can create cards without images)
- Display S3 URLs in preview and form

### Backend
✅ Already has:
- S3 service with presigned URL generation
- API endpoint for requesting presigned URLs
- Proper bucket configuration in `.env`

## Next Steps: Configure S3 CORS

Your S3 bucket `gosh-file-bucket` needs CORS configuration to allow frontend requests.

### Using AWS CLI
```bash
# Create cors-config.json with this content:
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD", "DELETE"],
      "AllowedOrigins": [
        "https://yoe7524zbi.execute-api.us-east-1.amazonaws.com",
        "https://d12345.cloudfront.net",
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.gosh.local"
      ],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}

# Apply to bucket
aws s3api put-bucket-cors --bucket gosh-file-bucket --cors-configuration file://cors-config.json
```

### Using AWS Console
1. Go to S3 > gosh-file-bucket > Permissions > CORS
2. Edit CORS and add:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD", "DELETE"],
    "AllowedOrigins": [
      "https://yoe7524zbi.execute-api.us-east-1.amazonaws.com",
      "https://d12345.cloudfront.net",
      "http://localhost:5173"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Environment Variables to Verify

### Backend (.env)
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
UPLOADS_BUCKET_NAME=gosh-file-bucket
```

### Frontend (.env)
```
REACT_APP_API_ENDPOINT=https://yoe7524zbi.execute-api.us-east-1.amazonaws.com
REACT_APP_UPLOADS_BUCKET_NAME=gosh-file-bucket
REACT_APP_AWS_REGION=us-east-1
```

## Testing the Upload

1. Build frontend: `npm run build` (from frontend/)
2. Start backend: `npm run dev` or deploy to Lambda
3. Go to admin dashboard
4. Try uploading an image
5. Check browser DevTools > Network tab for errors
6. Check S3 bucket to verify file was uploaded

## Troubleshooting

### Error: "Upload failed: 403"
- Check S3 bucket CORS policy is configured
- Verify AWS credentials in backend
- Check S3 bucket policy allows PutObject

### Error: "Failed to get presigned URL"
- Check backend is running and accessible
- Verify API endpoint in frontend config
- Check backend logs for errors

### Files appear but show 403 in browser
- Configure public read access OR
- Use CloudFront with presigned URLs OR
- Configure S3 bucket policy for your domain

## Image Storage Structure
Images are stored in S3 with this path structure:
```
s3://gosh-file-bucket/homepage-cards/{timestamp}-{random}-{filename}
```

URLs are stored in DynamoDB homepage_cards table as array.
