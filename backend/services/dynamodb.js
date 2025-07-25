import { getDynamoDBClient } from '../config/aws.js';
import { ScanCommand, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';


const TABLE_NAME = process.env.TODO_TABLE_NAME;
// Safeguard to ensure TABLE_NAME is defined
if (!TABLE_NAME) {
  console.log("Table Name: ",process.env.TODO_TABLE_NAME);
  throw new Error('TODO_TABLE_NAME environment variable is not set');
}

const dynamoDBClient = getDynamoDBClient();

export const getAllTodos = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  
  const { Items } = await dynamoDBClient.send(new ScanCommand(params));
  return Items ? Items.map(item => unmarshall(item)) : [];
};

export const getTodoById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ id }),
  };
  
  const { Item } = await dynamoDBClient.send(new GetItemCommand(params));
  return Item ? unmarshall(Item) : null;
};

export const createTodo = async (todo) => {
  const newTodo = {
    ...todo,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const params = {
    TableName: TABLE_NAME,
    Item: marshall(newTodo),
  };
  
  await dynamoDBClient.send(new PutItemCommand(params));
  return newTodo;
};

export const updateTodo = async (id, updates) => {
  const updateExpression = [];
  const expressionAttributeValues = {};
  const expressionAttributeNames = {};
  
  Object.entries(updates).forEach(([key, value]) => {
    updateExpression.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = value;
  });
  
  updateExpression.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();
  
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ id }),
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: marshall(expressionAttributeValues),
    ReturnValues: 'ALL_NEW',
  };
  
  const { Attributes } = await dynamoDBClient.send(new UpdateItemCommand(params));
  return Attributes ? unmarshall(Attributes) : null;
};

export const deleteTodo = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ id }),
    ReturnValues: 'ALL_OLD',
  };
  
  const { Attributes } = await dynamoDBClient.send(new DeleteItemCommand(params));
  return Attributes ? unmarshall(Attributes) : null;
};

export const toggleTodoStatus = async (id, completed) => {
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ id }),
    UpdateExpression: 'SET completed = :completed, updatedAt = :updatedAt',
    ExpressionAttributeValues: marshall({
      ':completed': completed,
      ':updatedAt': new Date().toISOString()
    }),
    ReturnValues: 'ALL_NEW',
  };
  
  const { Attributes } = await dynamoDBClient.send(new UpdateItemCommand(params));
  return Attributes ? unmarshall(Attributes) : null;
};