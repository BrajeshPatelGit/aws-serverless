import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
const REGION = "ap-south-1";
const ebClient = new EventBridgeClient({ region: REGION });
export { ebClient };