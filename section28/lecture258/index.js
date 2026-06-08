export const handler = async (event) => {
  throw new Error("Lambda Error");
  
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
