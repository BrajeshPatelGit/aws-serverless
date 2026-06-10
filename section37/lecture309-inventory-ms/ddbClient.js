import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-2";
const ddbClient = new DynamoDBClient({ region: REGION });
export { ddbClient };