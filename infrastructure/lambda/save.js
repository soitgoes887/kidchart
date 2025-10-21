const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({});

// Word lists for memorable UUIDs
const adjectives = [
    'happy', 'sunny', 'bright', 'calm', 'wise', 'brave', 'sweet', 'kind',
    'smart', 'cool', 'warm', 'gentle', 'proud', 'lucky', 'fresh', 'royal'
];

const nouns = [
    'puppy', 'kitten', 'bunny', 'tiger', 'eagle', 'star', 'moon', 'cloud',
    'river', 'ocean', 'mountain', 'forest', 'meadow', 'garden', 'rainbow', 'sunrise'
];

// Generate memorable UUID like "happy-puppy-2847"
function generateMemorableId() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return `${adj}-${noun}-${num}`;
}

exports.handler = async (event) => {
    try {
        const { children, id } = JSON.parse(event.body);

        if (!children || !Array.isArray(children)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Missing or invalid children data' })
            };
        }

        // Generate memorable ID if not provided, or use provided one
        const shareId = id || generateMemorableId();

        // Save to S3
        await s3.send(new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: `children/${shareId}.json`,
            Body: JSON.stringify({
                children,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            }),
            ContentType: 'application/json'
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                shareId,
                shareUrl: `https://kidchart.com/?share=${shareId}`
            })
        };
    } catch (error) {
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
