import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'eu-wast-1';
const ENDPOINT = process.env.DYNAMODB_ENDPOINT || null;

const dynamoDBConfig = {
  region: REGION,
  ...(ENDPOINT && { endpoint: ENDPOINT }), // For local development
};

const dynamoDBClient = new DynamoDBClient(dynamoDBConfig);
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

export { dynamoDB }