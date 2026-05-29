import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
  ScanCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.httpMethod) {
      case "DELETE": {
        const id = event.pathParameters?.id;
        if (!id) throw new Error("Missing path parameter: id");

        await dynamo.send(
          new DeleteCommand({
            TableName: "product",
            Key: { id },
          })
        );
        body = { message: `Deleted product ${id}` };
        break;
      }
      case "GET": {
        const id = event.pathParameters?.id;
        if (id) {
          body = await dynamo.send(
            new GetCommand({
              TableName: "product",
              Key: { id },
            })
          );
        } else {
          body = await dynamo.send(new ScanCommand({ TableName: "product" }));
        }
        break;
      }
      case "POST": {
        const requestJSON = JSON.parse(event.body || "{}");
        if (!requestJSON.id) {
          throw new Error("Missing product id in request body");
        }

        await dynamo.send(
          new PutCommand({
            TableName: "product",
            Item: {
              id: requestJSON.id,
              price: requestJSON.price,
              title: requestJSON.title,
              description: requestJSON.description,
            },
          })
        );
        body = { message: `Added/Updated product ${requestJSON.id}` };
        break;
      }
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = { error: err.message };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers,
  };
};
