// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ddbDocClient } from "../../../config/ddbDocClient";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";


export default async function dynamoDelete(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  console.log(typeof(req.body));
  const data = JSON.parse(req.body);
  console.log(data);
  const command = new DeleteCommand(data)
  console.log(command);
  const response = await ddbDocClient.send(command);
  return response;
}