import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';

let dynamoDBClientInstance = null;

export function getDynamoDBClient() {
  if (dynamoDBClientInstance) return dynamoDBClientInstance;
  
  const config = {
    region: process.env.AWS_REGION || 'eu-west-1',
  };

  // Local development configuration
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }
    if (process.env.DYNAMODB_ENDPOINT) {
      config.endpoint = process.env.DYNAMODB_ENDPOINT;
      config.sslEnabled = false;
    }
  }

  dynamoDBClientInstance = new DynamoDBClient(config);
  return dynamoDBClientInstance;
}

// Verification function
export async function verifyAWSCredentials() {
  try {
    const client = getDynamoDBClient();
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    
    console.log('✅ AWS Credentials Valid. Tables:', response.TableNames);
    console.log(`🔑 AWS Region: ${process.env.AWS_REGION || 'eu-west-1'}`);

    if (process.env.DYNAMODB_ENDPOINT) {
      console.log(`🔌 Using DynamoDB endpoint: ${process.env.DYNAMODB_ENDPOINT}`);
    }
    return true;
  } catch (error) {
    console.error('❌ AWS Credential Verification Failed:');
    console.error('Error Message:', error.message);
    
    // Detailed troubleshooting
    console.log('\nTroubleshooting Guide:');
    console.log('1. Check .env file for these variables:');
    console.log('   - AWS_REGION');
    console.log('   - AWS_ACCESS_KEY_ID');
    console.log('   - AWS_SECRET_ACCESS_KEY');
    console.log('   - DYNAMODB_ENDPOINT (for local development)');
    
    console.log('\n2. Verify local DynamoDB is running:');
    console.log('   docker run -p 8000:8000 amazon/dynamodb-local');
    
    console.log('\n3. Test credentials with AWS CLI:');
    console.log('   aws sts get-caller-identity');
    
    process.exit(1);
  }
}