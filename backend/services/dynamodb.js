import { dynamoDB } from '../config/aws.js';
import { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.TODO_TABLE_NAME;

export const getAllTodos = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  
  const { Items } = await dynamoDB.send(new ScanCommand(params));
  return Items || [];
};

export const getTodoById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };
  
  const { Item } = await dynamoDB.send(new GetCommand(params));
  return Item;
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
    Item: newTodo,
  };
  
  await dynamoDB.send(new PutCommand(params));
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
    Key: { id },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };
  
  const { Attributes } = await dynamoDB.send(new UpdateCommand(params));
  return Attributes;
};

export const deleteTodo = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    ReturnValues: 'ALL_OLD',
  };
  
  const { Attributes } = await dynamoDB.send(new DeleteCommand(params));
  return Attributes;
};