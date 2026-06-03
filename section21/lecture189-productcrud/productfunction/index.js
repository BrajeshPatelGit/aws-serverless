import { GetItemCommand, ScanCommand, PutItemCommand, DeleteItemCommand, UpdateItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient.js";
import { randomUUID } from "crypto";

export const handler = async function(event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    let body;

    try {
      switch (event.httpMethod) {
        case "GET":
          if (event.pathParameters != null && event.pathParameters.id != null) {
            if (event.queryStringParameters != null && event.queryStringParameters.category != null) {
              body = await getProductsByCategory(event);
            } else {
              body = await getProduct(event.pathParameters.id);
            }
          } else if (event.queryStringParameters != null && event.queryStringParameters.category != null) {
            body = await getProductsByCategory(event);
          } else {
            body = await getAllProducts();
          }
          break;
        case "POST":
          body = await createProduct(event);
          break;
        case "DELETE":
          if (event.pathParameters != null && event.pathParameters.id != null) {
            body = await deleteProduct(event.pathParameters.id);
          } else {
            throw new Error("Missing product id in path parameters");
          }
          break;
        case "PUT":
          if (event.pathParameters != null && event.pathParameters.id != null) {
            body = await updateProduct(event);
          } else {
            throw new Error("Missing product id in path parameters");
          }
          break;
        default:
          throw new Error(`Unsupported route: "${event.httpMethod}"`);
      }
      console.log(body);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully finished operation: "${event.httpMethod}"`,
          body: body
        })
      };      
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to perform operation.",
          errorMsg: e.message,
          errorStack: e.stack,
        })
      };
    }  
};

const getProduct = async (productId) => {
  console.log("getProduct");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: productId })
    };
 
    const { Item } = await ddbClient.send(new GetItemCommand(params));

    console.log(Item);
    return (Item) ? unmarshall(Item) : {};

  } catch (e) {
    console.error(e);
    throw e;
  }
}

const getAllProducts = async () => {
  console.log("getAllProducts");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME
    };
 
    const { Items } = await ddbClient.send(new ScanCommand(params));    

    console.log(Items);
    return (Items) ? Items.map((item) => unmarshall(item)) : {};

  } catch(e) {
    console.error(e);
    throw e;
  }
}

// xxx/product/1?category=Phone
const getProductsByCategory = async (event) => {
  console.log("getProductsByCategory");
  try {
    const productId = event.pathParameters?.id;
    const category = event.queryStringParameters.category;

    if (!category) {
      return [];
    }

    let params;
    let Items;

    if (productId) {
      params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        KeyConditionExpression: "id = :productId",
        FilterExpression: "contains (category, :category)",
        ExpressionAttributeValues: {
          ":productId": { S: productId },
          ":category": { S: category }
        }
      };
      ({ Items } = await ddbClient.send(new QueryCommand(params)));
    } else {
      params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        FilterExpression: "contains (category, :category)",
        ExpressionAttributeValues: {
          ":category": { S: category }
        }
      };
      ({ Items } = await ddbClient.send(new ScanCommand(params)));
    }

    console.log(Items);
    return (Items) ? Items.map((item) => unmarshall(item)) : [];
  } catch(e) {
    console.error(e);
    throw e;
  }
}

const createProduct = async (event) => {
  try {
    console.log(`createProduct function. event : ${JSON.stringify(event)}`);

    const productRequest = JSON.parse(event.body);
    // set productid
    const productId = randomUUID();
    productRequest.id = productId;

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(productRequest || {})
    };

    const createResult = await ddbClient.send(new PutItemCommand(params));
    console.log(createResult);
    return createResult;

  } catch(e) {
    console.error(e);
    throw e;
  }
}

const deleteProduct = async (productId) => {
  try {
    console.log(`deleteProduct function. productId : "${productId}"`);

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: productId })
    };  

    const deleteResult = await ddbClient.send(new DeleteItemCommand(params));
    console.log(deleteResult);
    return deleteResult;

  } catch(e) {
    console.error(e);
    throw e;
  }
}

const updateProduct = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    // Filter out the 'id' field since it's the partition key and cannot be updated
    const updateKeys = Object.keys(requestBody).filter(key => key !== 'id');
    
    if (updateKeys.length === 0) {
      throw new Error("No attributes to update");
    }
    
    console.log(`updateProduct function. requestBody : "${JSON.stringify(requestBody)}", updateKeys: "${updateKeys}"`);

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: event.pathParameters.id }),
      UpdateExpression: `SET ${updateKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
      ExpressionAttributeNames: updateKeys.reduce((acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
      }), {}),
      ExpressionAttributeValues: marshall(updateKeys.reduce((acc, key, index) => ({
          ...acc,
          [`:value${index}`]: requestBody[key],
      }), {})),
    };

    const updateResult = await ddbClient.send(new UpdateItemCommand(params));
    console.log(updateResult);
    return updateResult;

  } catch(e) {
    console.error(e);
    throw e;
  }
}
