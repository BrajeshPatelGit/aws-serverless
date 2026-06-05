import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "./s3client.js";
import fs from "fs";

const file = "./index11.html";
const fileStream = fs.createReadStream(file);

const params = {
    Bucket: "sdk-s3-bucket-12",
    Key: "index11.html",
    Body: fileStream
};

export const run = async () => {
  try {
    const data = await s3client.send(new PutObjectCommand(params));
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
};
run();