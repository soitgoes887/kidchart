const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({});

exports.handler = async (event) => {
    try {
        const shareId = event.queryStringParameters?.id;

        if (!shareId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Missing share ID' })
            };
        }

        // Validate shareId format (word-word-number)
        if (!/^[a-z]+-[a-z]+-\d{4}$/.test(shareId)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Invalid share ID format' })
            };
        }

        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: `children/${shareId}.json`
        });

        const data = await s3.send(command);
        const body = await data.Body.transformToString();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        };
    } catch (error) {
        if (error.name === 'NoSuchKey') {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Share ID not found' })
            };
        }

        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
