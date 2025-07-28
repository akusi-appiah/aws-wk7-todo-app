const { DynamoDBClient,DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

let dynamoDBClientInstance = null;

function getDynamoDBClient() {
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
  }else {
    // Explicitly ensure no endpoint is set in production
    delete config.endpoint;
    delete config.sslEnabled;
  }

  dynamoDBClientInstance = new DynamoDBClient(config);
  return dynamoDBClientInstance;
}

async function verifyAWSCredentials() {
  try {
    const client = getDynamoDBClient();
    const command = new DescribeTableCommand({ TableName: process.env.TODO_TABLE_NAME });
    const response = await client.send(command);
    
    console.log('✅ AWS Credentials Valid. :', response.Table.TableName);
    console.log(`🔑 AWS Region: ${process.env.AWS_REGION || 'eu-west-1'}`);

    if (process.env.DYNAMODB_ENDPOINT) {
      console.log(`🔌 Using DynamoDB endpoint: ${process.env.DYNAMODB_ENDPOINT}`);
    }
    return true;
  } catch (error) {
    console.error('❌ AWS Credential Verification Failed:');
    console.error('Error Message:', error.message);
    
    console.log('\nTroubleshooting Guide:');
    console.log('1. Ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are set correctly.');
    process.exit(1);
  }
}

module.exports = {
  getDynamoDBClient,
  verifyAWSCredentials
};