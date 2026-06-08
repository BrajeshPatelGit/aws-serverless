import { DeleteQueueCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./sqsClient.js";

const params = {
    QueueUrl: "https://sqs.ap-south-1.amazonaws.com/229209687346/lambda-sqs"   
};

export const run = async () => {
    try {
      const data = await sqsClient.send(new DeleteQueueCommand(params));
      console.log("Success", data);
    } catch (err) {
      console.log("Error", err);
    }
};
run();