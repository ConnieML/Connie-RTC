//Setting up marshalling and unmarshalling, which is how data is converted between js and dynamo

// Create a service client module using ES6 syntax.
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ddbClient } from "./dbconfig.js";

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false,
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true,
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false,
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false,
};

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions,
  unmarshallOptions,
});

export { ddbDocClient };