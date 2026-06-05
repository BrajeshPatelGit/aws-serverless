import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3client } from "./s3client.js";

export const run = async () => {
  try {
    const data = await s3client.send(new ListBucketsCommand({}));
    console.log("Success", data.Buckets);
  } catch (err) {
    console.log("Error", err);
  }
};
run();