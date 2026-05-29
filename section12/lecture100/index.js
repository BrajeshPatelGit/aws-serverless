export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
  
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return { "statusCode": 200, "body": JSON.stringify({ "message": "Success" }) };
};
