# GOSH Project - AWS DynamoDB Setup Guide

## Overview

This guide covers deploying the GOSH Project to AWS using **DynamoDB** instead of RDS for significant cost reduction.

### Key Benefits of DynamoDB

- **Pay-Per-Request**: Only pay for actual database operations
- **Auto-Scaling**: Automatically handles traffic spikes
- **No Server Management**: Fully managed service
- **Fast**: Sub-millisecond latency
- **Cost**: ~$0-10/month for low-traffic apps vs $15-35 with RDS

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (S3 + CloudFront)          │
└────────────────────┬────────────────────────────────┘
                     │
           ┌─────────▼──────────┐
           │  API Gateway       │
           │  (Lambda)          │
           └────────┬───────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
    ┌───▼────┐  ┌──▼──┐  ┌────▼────┐
    │DynamoDB│  │S3   │  │CloudWatch
    │(single │  │Files│  │(Logs)
    │table)  │  │     │  │
    └────────┘  └─────┘  └─────────┘
```

## DynamoDB Single Table Design

All data is stored in one DynamoDB table with entity type differentiation:

### Table Structure

**Table Name**: `gosh-data-{environment}`

**Partition Key (PK)**: `entityId` (string)
- Format: `{TYPE}#{ID}`
- Examples: `SOLUTION#123`, `CUSTOMER#456`, `BOOKING#789`

**Sort Key (SK)**: `timestamp` (number)
- Unix timestamp in milliseconds
- Allows sorting within entity type

**Global Secondary Indexes (GSI)**:

1. **type-timestamp-index**
   - PK: `type` (query all items of specific type)
   - SK: `timestamp`

2. **email-index**
   - PK: `email` (find customers by email)
   - SK: `timestamp`

3. **id-index**
   - PK: `id` (query by id)
   - SK: `type`

### Entity Types

| Type | Entity |
|------|--------|
| `INDUSTRY` | Industry/vertical |
| `SOLUTION` | Product/solution |
| `CUSTOMER` | Customer profile |
| `BOOKING` | Demo/discussion/hosting request |
| `PAYMENT` | Payment record |
| `QUOTATION` | Quotation request |
| `HOMEPAGE_CARD` | Homepage card content |
| `HOMEPAGE_BG` | Homepage background |

## Setup Instructions

### 1. Configure Environment

```bash
# Copy example file
cp .env.aws-dynamodb.example .env

# Edit with your AWS settings
nano .env
```

**Required values**:
- `AWS_REGION`
- `AWS_ACCOUNT_ID`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DYNAMODB_TABLE_NAME`
- `JWT_SECRET` (generate: `openssl rand -base64 32`)

### 2. Install Dependencies

```bash
cd backend

# Copy DynamoDB package config
cp package-dynamodb.json package.json

# Install dependencies
npm install
```

### 3. Build for Lambda

```bash
npm run build:lambda
```

### 4. Update Lambda Handler

```bash
# Replace the lambda.ts to use app-dynamodb.ts
cp src/app-dynamodb.ts src/app.ts
```

### 5. Deploy to AWS

```bash
# Deploy using DynamoDB serverless config
serverless deploy -c serverless-dynamodb.yml --stage dev

# Note the API endpoint, add to .env
```

## Local Development

### Start DynamoDB Locally

```bash
# Install DynamoDB local (one-time)
npm run dynamodb:create

# Start DynamoDB in Docker
npm run dev:dynamodb

# Runs on http://localhost:8000
```

### Start Lambda Locally

```bash
# In another terminal
npm run dev:lambda

# Runs on http://localhost:3001
# DynamoDB connects to local instance
```

### Test Endpoints

```bash
# Get homepage data
curl http://localhost:3001/api/homepage

# Request demo
curl -X POST http://localhost:3001/api/demo-requests \
  -H "Content-Type: application/json" \
  -d '{
    "solutionId": "1",
    "requestedDate": "2024-05-01",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "message": "I want to schedule a demo"
  }'
```

## Query Examples

### Get All Solutions

```
QueryCommand {
  TableName: "gosh-data-dev",
  IndexName: "type-timestamp-index",
  KeyConditionExpression: "type = :type",
  ExpressionAttributeValues: { ":type": "SOLUTION" }
}
```

### Get All Demo Requests

```
QueryCommand {
  TableName: "gosh-data-dev",
  IndexName: "type-timestamp-index",
  KeyConditionExpression: "type = :type",
  ExpressionAttributeValues: { ":type": "BOOKING" },
  FilterExpression: "bookingType = :bookingType",
  ExpressionAttributeValues: { ":bookingType": "demo" }
}
```

### Find Customer by Email

```
QueryCommand {
  TableName: "gosh-data-dev",
  IndexName: "email-index",
  KeyConditionExpression: "email = :email",
  ExpressionAttributeValues: { ":email": "john@example.com" }
}
```

## Data Migration from RDS

If migrating from RDS, use this process:

### 1. Export RDS Data

```bash
# Create SQL dump
mysqldump -h {RDS_HOST} -u {USER} -p {DATABASE} > dump.sql
# Or PostgreSQL
pg_dump -h {RDS_HOST} -U {USER} {DATABASE} > dump.sql
```

### 2. Transform to DynamoDB Format

```bash
npm run migrate:rds-to-dynamodb

# This converts SQL data to DynamoDB items
# and batch writes to DynamoDB table
```

### 3. Verify Data

```bash
# Query DynamoDB to verify data
aws dynamodb scan --table-name gosh-data-dev \
  --region us-east-1 \
  --max-items 10
```

## Monitoring

### View Lambda Logs

```bash
# Stream logs in real-time
serverless logs -f api -t

# View specific time range
aws logs tail /aws/lambda/gosh-api-dev-api --follow
```

### Monitor DynamoDB

```bash
# View consumed capacity
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedWriteCapacityUnits \
  --dimensions Name=TableName,Value=gosh-data-dev \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum

# View item count
aws dynamodb describe-table --table-name gosh-data-dev \
  --region us-east-1 \
  --query 'Table.ItemCount'
```

## Cost Optimization

### 1. Billing Mode

**Pay-Per-Request** (Recommended):
- No minimum charge
- Scales automatically
- Best for variable traffic
- $1.25 per 1GB/month + $1 per 1M write units + $0.25 per 1M read units

**Provisioned**:
- Fixed capacity
- Better for predictable traffic
- ~$2.5 for base capacity
- Manual scaling available

### 2. TTL (Time-To-Live)

Enable TTL to automatically delete old records:

```bash
aws dynamodb update-time-to-live \
  --table-name gosh-data-dev \
  --time-to-live-specification AttributeName=expiresAt,Enabled=true
```

### 3. Point-in-Time Recovery

Enable for backups without cost:

```bash
aws dynamodb update-continuous-backups \
  --table-name gosh-data-dev \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

## Backup & Restore

### Create Backup

```bash
# On-demand backup
aws dynamodb create-backup \
  --table-name gosh-data-dev \
  --backup-name gosh-backup-$(date +%s)
```

### List Backups

```bash
aws dynamodb list-backups --table-name gosh-data-dev
```

### Restore from Backup

```bash
aws dynamodb restore-table-from-backup \
  --target-table-name gosh-data-restored \
  --backup-arn arn:aws:dynamodb:...
```

## Scaling

### Auto-Scaling (Provisioned Mode)

Enable auto-scaling for predictable growth:

```bash
aws application-autoscaling register-scalable-target \
  --service-namespace dynamodb \
  --resource-id table/gosh-data-dev \
  --scalable-dimension dynamodb:table:WriteCapacityUnits \
  --min-capacity 5 \
  --max-capacity 100
```

### Global Tables (Multi-Region)

For disaster recovery and global users:

```bash
aws dynamodb create-global-table \
  --global-table-name gosh-data \
  --replication-group RegionName=us-east-1 RegionName=eu-west-1
```

## Troubleshooting

### Issue: "ValidationException: One or more parameter values were invalid"

**Solution**: Check attribute names and types in query

### Issue: "ResourceNotFoundException: Requested resource not found"

**Solution**: Ensure table exists
```bash
aws dynamodb describe-table --table-name gosh-data-dev
```

### Issue: "ProvisionedThroughputExceededException"

**Solution**: Increase capacity or use Pay-Per-Request billing mode

### Issue: High query costs

**Solution**:
- Use more specific GSI queries
- Enable DynamoDB compression
- Remove unused GSI
- Archive old data to S3

## Switching Between RDS and DynamoDB

### To Use DynamoDB:

```bash
# Update files
cp src/app-dynamodb.ts src/app.ts
cp serverless-dynamodb.yml serverless.yml
cp package-dynamodb.json package.json

# Deploy
npm run build:lambda
serverless deploy
```

### Back to RDS:

```bash
# Restore files
cp src/app-rds.ts src/app.ts
cp serverless-rds.yml serverless.yml
cp package-rds.json package.json

# Deploy
npm run build:lambda
serverless deploy
```

## Cost Comparison

| Component | DynamoDB | RDS |
|-----------|----------|-----|
| Database | $0-20 | $15-30 |
| Lambda | $0 | $0 |
| S3 | $1-5 | $1-5 |
| CloudFront | $0-5 | $0-5 |
| **Total/month** | **$1-30** | **$16-40** |

**DynamoDB saves ~50% on database costs!**

## Best Practices

1. **Use Entity Types**: Always set `type` attribute for filtering
2. **Optimize Indexes**: Only create needed GSI to reduce costs
3. **Batch Operations**: Use BatchGetItem/BatchWriteItem for bulk operations
4. **Monitor Usage**: Watch CloudWatch metrics for optimization
5. **Archive Old Data**: Move old records to S3 for cost savings
6. **Use Conditional Writes**: Prevent duplicate/conflicting writes
7. **Enable Encryption**: Encrypt at rest and in transit

## Additional Resources

- [AWS DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [AWS DynamoDB Pricing](https://aws.amazon.com/dynamodb/pricing/)
- [Single Table Design Patterns](https://aws.amazon.com/blogs/database/single-table-design-with-amazon-dynamodb/)

---

**Last Updated**: April 2024
**Project**: GOSH
**Database**: AWS DynamoDB
