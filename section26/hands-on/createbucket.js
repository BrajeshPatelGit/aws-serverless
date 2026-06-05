import { CreateBucketCommand } from "@aws-sdk/client-s3";
import { s3client } from "./s3client.js";

const params = {
    Bucket: "sdk-s3-bucket-12" 
};

export const run = async () => {
  try {
    const data = await s3client.send(new CreateBucketCommand(params));
    console.log("Success", data.Location);
  } catch (err) {
    console.log("Error", err);
  }
};
run();