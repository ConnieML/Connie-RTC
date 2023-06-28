import type { NextApiRequest, NextApiResponse } from 'next'
import { ddbDocClient } from "../../../config/ddbDocClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";


export default async function dynamoCreate(req: NextApiRequest, res: NextApiResponse) {
  const data = JSON.parse(req.body);
  const command = new PutCommand(data);

  const response = await ddbDocClient.send(command);
  return response;
}