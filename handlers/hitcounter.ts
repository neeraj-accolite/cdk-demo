import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { Lambda } = require('@aws-sdk/client-lambda');

exports.handler = async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  // create AWS SDK clients
  const dynamo = new DynamoDB();
  const lambda = new Lambda();

  // update dynamo entry for "path" with hits++
  await dynamo.updateItem({
    TableName: process.env.HITS_TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: 'ADD hits :incr',
    ExpressionAttributeValues: { ':incr': { N: '1' } }
  });

  // call downstream function and capture response
  const resp = await lambda.invoke({
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
    Payload: JSON.stringify(event)
  });

  console.log('downstream response:', JSON.stringify(resp, undefined, 2));

  // return response back to upstream caller
  return {
    statusCode: 200,
    body: "Data saved successfully"
  };
};