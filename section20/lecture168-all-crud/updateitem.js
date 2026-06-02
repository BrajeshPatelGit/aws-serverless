import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddbClient.js";

export const params = {
    TableName: "product",
    Key: {
        id: { N: "11" }
    },
    UpdateExpression: "SET productName = :newval",
    ExpressionAttributeValues: {
        ":newval": { S: "updated iphone11 " } 
    },
    ReturnValues: "ALL_NEW"
};

export const run = async () => {
    try {
        const data = await ddbClient.send(new UpdateItemCommand(params));
        console.log(data);
    } catch (error) {
        console.log("Error", error);
    }
}
run();