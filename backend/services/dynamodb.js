const { getDynamoDBClient } = require('../config/aws');
const { ScanCommand, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const TABLE_NAME = process.env.TODO_TABLE_NAME;
const dynamoDBClient = getDynamoDBClient();

// Safeguard to ensure TABLE_NAME is defined
if (!TABLE_NAME) {
  throw new Error('TODO_TABLE_NAME environment variable is not set');
}

const getAllTodos = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  
  const { Items } = await dynamoDBClient.send(new ScanCommand(params));
  return Items ? Items.map(item => unmarshall(item)) : [];
};

const getTodoById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ id }),
  };
  
  const { Item } = await dynamoDBClient.send(new GetItemCommand(params));
  return Item ? unmarshall(Item) : null;
};

const createTodo = async (todo) => {
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

const updateTodo = async (id, updates) => {
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

const deleteTodo = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ id }),
    ReturnValues: 'ALL_OLD',
  };
  
  const { Attributes } = await dynamoDBClient.send(new DeleteItemCommand(params));
  return Attributes ? unmarshall(Attributes) : null;
};

const toggleTodoStatus = async (id, completed) => {
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

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus
};