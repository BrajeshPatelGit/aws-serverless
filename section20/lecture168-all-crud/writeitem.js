import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddbClient.js";

export const params = {
    TableName: "product",
    Item: {
        id: { N: "3" },
        productName: { S: "iphone3" },
    }
};

export const run = async () => {
    try {        
        const data = await ddbClient.send(new PutItemCommand(params));
        console.log(data);
    } catch (error) {
        console.log("Error", error);
    }
}
run();