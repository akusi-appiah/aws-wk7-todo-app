import { dynamoDB } from '../config/aws.js';
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';

export const checkDatabaseHealth = async () => {
  try {
    const command = new DescribeTableCommand({
      TableName: process.env.TODO_TABLE_NAME
    });
    
    const response = await dynamoDB.send(command);
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

export const getSystemStatus = () => {
  return {
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
  };
};