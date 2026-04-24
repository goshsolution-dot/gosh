# GOSH Solutions Platform

Serverless MVP platform for GOSH Solutions on AWS Lambda + DynamoDB.

## Architecture

- `backend/` - Express API deployed on AWS Lambda (serverless) with DynamoDB
- `frontend/` - React + Vite SPA deployed on S3 + CloudFront
- `database/` - DynamoDB (NoSQL, auto-scaling, pay-per-request)
- `storage/` - S3 for file uploads with presigned URLs

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Setup environment
cp backend/.env.example backend/.env

# Start backend (DynamoDB local)
npm run dev:backend

# Start frontend
npm run dev:frontend
```

### AWS Deployment
See [DYNAMODB-SETUP-GUIDE.md](DYNAMODB-SETUP-GUIDE.md) for complete AWS deployment instructions.

## Project Features

### Public Website
- **Solutions Listing**: Browse software solutions by industry
- **Industry Filtering**: Filter by Education, Retail, Health sectors
- **Demo Requests**: Submit demo request forms
- **Discussion Booking**: Schedule consultation calls
- **Payment Management**: Track payment submissions
- **Hosting Requests**: Request hosting services

### Admin Dashboard
- **JWT Authentication**: Secure admin login
- **Dashboard Overview**: Key metrics and statistics
- **Records Management**: View and manage all system data
- **Data Tables**: Organized tabbed interface

## API Endpoints

### Public Routes
- `GET /api/industries` - Get industries with solutions
- `GET /api/solutions` - List solutions (filterable)
- `GET /api/solutions/:id` - Get solution details
- `POST /api/demo-requests` - Submit demo request
- `POST /api/discussions` - Book discussion
- `POST /api/payments` - Submit payment
- `POST /api/hosting-requests` - Request hosting

### Admin Routes (JWT Protected)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/overview` - Dashboard statistics
- `GET /api/admin/records` - All system records

## DynamoDB Tables

- **Industries**: id, name
- **Solutions**: id, name, description, industry_id, demo_link, demo_available
- **Customers**: id, name, email, phone, created_at
- **Bookings**: id, type, customer_id, solution_id, requested_date, message, provider, service_details
- **Payments**: id, customer_id, amount, transaction_reference, service, created_at

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, AWS Lambda
- **Database**: AWS DynamoDB (serverless NoSQL)
- **Storage**: AWS S3 (file uploads)
- **Frontend**: React, TypeScript, Vite, React Router
- **Deployment**: Serverless Framework, CloudFront CDN
- **Authentication**: JWT tokens

## Cost Estimate

- **Lambda**: ~$0.20/1M requests
- **DynamoDB**: ~$0.25/1M read units, $1.25/1M write units (on-demand)
- **S3**: ~$0.023/GB stored
- **CloudFront**: ~$0.085/GB (US regions)
- **Total**: ~$1-15/month for startup traffic

## Environment Setup

Create `backend/.env`:
```env
# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# DynamoDB Tables
DYNAMODB_INDUSTRIES_TABLE=gosh-industries
DYNAMODB_SOLUTIONS_TABLE=gosh-solutions
DYNAMODB_CUSTOMERS_TABLE=gosh-customers
DYNAMODB_BOOKINGS_TABLE=gosh-bookings
DYNAMODB_PAYMENTS_TABLE=gosh-payments

# S3
S3_UPLOADS_BUCKET=gosh-uploads
AWS_REGION=us-east-1

# Auth
JWT_SECRET=your_jwt_secret_key

# Admin
ADMIN_EMAIL=admin@gosh.com
ADMIN_PASSWORD=secure_password
```

## Deployment

```bash
# Deploy to AWS Lambda
npm run deploy

# View logs
serverless logs -f api --stage dev

# Monitor
serverless info --stage dev
```

## Support

For detailed setup instructions, see [DYNAMODB-SETUP-GUIDE.md](DYNAMODB-SETUP-GUIDE.md)
