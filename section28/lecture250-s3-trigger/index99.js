import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient.js";

export const handler = async function(event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  // 1- List objects into bucket
  // 2- write on dynamodb table

  try {
    // 1- List objects into bucket
    const params = {
      Bucket: event.Records[0].s3.bucket.name // "s3-bucket-3424"  // event.Records[0].s3.bucket.name
    };
    const objectList = await s3Client.send(new ListObjectsV2Command(params));
    console.log("Success", objectList);

    // 2- write on dynamodb table
 } catch (e) {
    console.error(e);
  }
};
handler();