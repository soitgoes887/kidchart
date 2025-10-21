import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Common tags for all resources
const commonTags = {
    site: "kidchart",
    managedBy: "pulumi",
    project: "kidchart",
};

// Get AWS account ID for budget alerts
const accountId = pulumi.output(aws.getCallerIdentity({})).accountId;

// S3 bucket for children data storage (free tier: 5GB storage, 20k GET, 2k PUT/month)
const childrenBucket = new aws.s3.Bucket("kidchart-children-data", {
    bucket: "kidchart-children-data",
    acl: "private",
    tags: commonTags,
    serverSideEncryptionConfiguration: {
        rule: {
            applyServerSideEncryptionByDefault: {
                sseAlgorithm: "AES256",
            },
        },
    },
    lifecycleRules: [{
        enabled: true,
        expiration: {
            days: 730, // Auto-delete old data after 2 years
        },
    }],
    corsRules: [{
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST"],
        allowedOrigins: ["https://kidchart.com", "http://localhost:5173", "http://127.0.0.1:5173"],
        exposeHeaders: ["ETag"],
        maxAgeSeconds: 3000,
    }],
});

// SNS topic for billing alerts
const billingAlertTopic = new aws.sns.Topic("kidchart-billing-alerts", {
    name: "kidchart-billing-alerts",
    displayName: "KidChart Billing Alerts",
    tags: commonTags,
});

// SNS topic subscription
const billingAlertSubscription = new aws.sns.TopicSubscription("kidchart-billing-alert-email", {
    topic: billingAlertTopic.arn,
    protocol: "email",
    endpoint: "hello@kidchart.com",
});

// Budget alert for AWS costs
const monthlyBudget = new aws.budgets.Budget("kidchart-monthly-budget", {
    name: "kidchart-monthly-budget",
    budgetType: "COST",
    limitAmount: "5.00", // Alert if monthly costs exceed $5
    limitUnit: "USD",
    timeUnit: "MONTHLY",
    // Track all costs (cost filters are optional and can be complex with tags)
    notifications: [{
        comparisonOperator: "GREATER_THAN",
        threshold: 80, // Alert at 80% of budget ($4)
        thresholdType: "PERCENTAGE",
        notificationType: "ACTUAL",
        subscriberSnsTopicArns: [billingAlertTopic.arn],
    }, {
        comparisonOperator: "GREATER_THAN",
        threshold: 100, // Alert at 100% of budget ($5)
        thresholdType: "PERCENTAGE",
        notificationType: "ACTUAL",
        subscriberSnsTopicArns: [billingAlertTopic.arn],
    }],
});

// IAM role for Lambda
const lambdaRole = new aws.iam.Role("kidchart-lambda-role", {
    name: "kidchart-lambda-role",
    tags: commonTags,
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Principal: { Service: "lambda.amazonaws.com" },
            Effect: "Allow",
        }],
    }),
});

// Attach basic execution policy
new aws.iam.RolePolicyAttachment("kidchart-lambda-basic", {
    role: lambdaRole,
    policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

// S3 access policy
new aws.iam.RolePolicy("kidchart-lambda-s3-policy", {
    name: "kidchart-lambda-s3-policy",
    role: lambdaRole,
    policy: pulumi.all([childrenBucket.arn]).apply(([bucketArn]) => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: ["s3:GetObject", "s3:PutObject"],
            Resource: `${bucketArn}/*`,
        }],
    })),
});

// Save children data Lambda
const saveChildrenLambda = new aws.lambda.Function("kidchart-save-children", {
    name: "kidchart-save-children",
    runtime: "nodejs20.x",
    role: lambdaRole.arn,
    handler: "index.handler",
    tags: commonTags,
    code: new pulumi.asset.AssetArchive({
        "index.js": new pulumi.asset.FileAsset("./lambda/save.js"),
    }),
    environment: {
        variables: {
            BUCKET_NAME: childrenBucket.bucket,
        },
    },
    reservedConcurrentExecutions: 10, // Limit to prevent abuse
    timeout: 10, // 10 seconds timeout
    memorySize: 256, // 256 MB memory
});

// Load children data Lambda
const loadChildrenLambda = new aws.lambda.Function("kidchart-load-children", {
    name: "kidchart-load-children",
    runtime: "nodejs20.x",
    role: lambdaRole.arn,
    handler: "index.handler",
    tags: commonTags,
    code: new pulumi.asset.AssetArchive({
        "index.js": new pulumi.asset.FileAsset("./lambda/load.js"),
    }),
    environment: {
        variables: {
            BUCKET_NAME: childrenBucket.bucket,
        },
    },
    reservedConcurrentExecutions: 10, // Limit to prevent abuse
    timeout: 10, // 10 seconds timeout
    memorySize: 256, // 256 MB memory
});

// Lambda Function URLs (free, no API Gateway needed)
const saveFunctionUrl = new aws.lambda.FunctionUrl("kidchart-save-url", {
    functionName: saveChildrenLambda.name,
    authorizationType: "NONE",
    cors: {
        allowOrigins: ["https://kidchart.com", "http://localhost:5173", "http://127.0.0.1:5173"],
        allowMethods: ["POST"],
        allowHeaders: ["content-type"],
        maxAge: 3600,
    },
});

const loadFunctionUrl = new aws.lambda.FunctionUrl("kidchart-load-url", {
    functionName: loadChildrenLambda.name,
    authorizationType: "NONE",
    cors: {
        allowOrigins: ["https://kidchart.com", "http://localhost:5173", "http://127.0.0.1:5173"],
        allowMethods: ["GET"],
        allowHeaders: ["content-type"],
        maxAge: 3600,
    },
});

// Outputs
export const bucketName = childrenBucket.bucket;
export const saveUrl = saveFunctionUrl.functionUrl;
export const loadUrl = loadFunctionUrl.functionUrl;
export const billingAlertTopicArn = billingAlertTopic.arn;
