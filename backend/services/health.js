const { getDynamoDBClient } = require('../config/aws.js') ;
const { DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

const dynamoDBClient = getDynamoDBClient();

const checkDatabaseHealth = async () => {
  try {
    const command = new DescribeTableCommand({
      TableName: process.env.TODO_TABLE_NAME
    });
    
    const response = await dynamoDBClient.send(command);
    return {
      status: 'UP',
      details: {
        tableName: response.Table.TableName,
        tableStatus: response.Table.TableStatus,
        itemCount: response.Table.ItemCount,
      }
    };
  } catch (error) {
    return {
      status: 'DOWN',
      details: {
        error: error.message,
      }
    };
  }
};

const getSystemStatus = () => {
  return {
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
  };
};

module.exports = {
  checkDatabaseHealth,
  getSystemStatus,
};