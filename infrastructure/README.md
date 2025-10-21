# KidChart Infrastructure

AWS infrastructure for KidChart child growth data sharing using Pulumi, S3, and Lambda.

## Architecture

- **S3 Bucket**: Stores children growth data with encryption
- **Lambda Functions**: Serverless APIs for save/load operations
- **Function URLs**: Direct HTTPS endpoints (no API Gateway needed)
- **Memorable Share IDs**: Easy-to-remember format like `happy-puppy-2847`
- **Budget Alerts**: Email notifications if costs exceed $5/month

## Share ID Format

Share IDs use a memorable format: `[adjective]-[noun]-[4-digit-number]`

Examples:
- `happy-puppy-2847`
- `bright-star-5923`
- `sunny-ocean-1456`

This makes it easy for users to share and remember links!

## Prerequisites

1. **AWS Account**: Sign up at https://aws.amazon.com
2. **AWS CLI**: Install and configure with `aws configure`
3. **Pulumi**: Install from https://www.pulumi.com/docs/get-started/install/
4. **Node.js 20+**: For Lambda runtime

## Setup

```bash
# 1. Navigate to infrastructure directory
cd infrastructure

# 2. Install dependencies
npm install

# 3. Login to Pulumi (free for individuals)
pulumi login

# 4. Create a new stack (e.g., "dev")
pulumi stack init dev

# 5. Set AWS region
pulumi config set aws:region us-east-1

# 6. Update email for billing alerts
# Edit index.ts line 38: endpoint: "your-email@example.com"

# 7. Deploy infrastructure
npm run deploy
```

## Deployment

```bash
# Deploy changes
npm run deploy

# View current stack outputs
pulumi stack output

# Destroy infrastructure (careful!)
npm run destroy
```

## Outputs

After deployment, you'll get:

- **bucketName**: S3 bucket name
- **saveUrl**: Lambda URL for saving children data
- **loadUrl**: Lambda URL for loading children data
- **billingAlertTopicArn**: SNS topic for alerts

## API Usage

### Save Children Data

```bash
POST {saveUrl}
Content-Type: application/json

{
  "children": [
    {
      "id": "123",
      "name": "Emma",
      "dateOfBirth": "2023-01-15",
      "gender": "female",
      "measurements": [...]
    }
  ]
}

# Response:
{
  "success": true,
  "shareId": "happy-puppy-2847",
  "shareUrl": "https://kidchart.com/?share=happy-puppy-2847"
}
```

### Load Children Data

```bash
GET {loadUrl}?id=happy-puppy-2847

# Response:
{
  "children": [...],
  "createdAt": "2025-10-20T...",
  "lastModified": "2025-10-20T..."
}
```

## Cost Estimates

**Free Tier (First 12 months):**
- Lambda: 1M requests/month + 400,000 GB-seconds compute
- S3: 5GB storage, 20,000 GET, 2,000 PUT requests
- Data Transfer: 1GB/month outbound

**After Free Tier (~$0.50/month for moderate use):**
- Lambda: $0.20 per 1M requests + $0.0000166667 per GB-second
- S3: $0.023 per GB storage + $0.0004 per 1,000 GET
- Data Transfer: $0.09 per GB

**Budget Alert**: Set to $5/month with notifications at 80% and 100%

## Security Features

- ✅ Server-side encryption (AES256)
- ✅ Private S3 bucket (no public access)
- ✅ CORS enabled only for kidchart.com
- ✅ Concurrent execution limits (prevents abuse)
- ✅ Share ID validation
- ✅ Auto-deletion after 2 years

## Data Lifecycle

- Data is automatically deleted after **2 years**
- Users can re-save to extend lifetime
- No personal identification required
- Share IDs are random and unguessable

## Integration with Frontend

Add to your React app:

```typescript
// Save children data
const saveChildren = async (children: Child[]) => {
  const response = await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ children })
  });
  const { shareId, shareUrl } = await response.json();
  return { shareId, shareUrl };
};

// Load children data
const loadChildren = async (shareId: string) => {
  const response = await fetch(`${LOAD_URL}?id=${shareId}`);
  const { children } = await response.json();
  return children;
};
```

## Monitoring

- **CloudWatch Logs**: View Lambda execution logs
- **Cost Explorer**: Track AWS spending
- **Email Alerts**: Receive notifications at 80% and 100% of budget

## Troubleshooting

### Lambda cold starts
- First request after deployment may take 2-3 seconds
- Subsequent requests are fast (<100ms)

### CORS errors
- Ensure you're calling from https://kidchart.com
- Local development: Use http://localhost:5173

### Share ID not found
- Share IDs expire after 2 years
- Check format: `word-word-number`

## Development

To modify Lambda functions:

```bash
# Edit lambda/save.js or lambda/load.js
# Then redeploy
npm run deploy
```

## Clean Up

To remove all infrastructure:

```bash
npm run destroy
```

**Warning**: This deletes the S3 bucket and all data!

## Support

Issues? Email: hello@kidchart.com
