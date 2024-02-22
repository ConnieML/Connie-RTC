import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3 = new S3Client({ region: 'us-east-2' });
const bucket_name = process.env.BUCKET_NAME;

export const putObject = async (key: string, body: string) => {
  const params = {
    Bucket: bucket_name,
    Key: key,
    Body: body,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
};

export const getObjectString = async (key: string) => {
  const params = {
    Bucket: bucket_name,
    Key: key,
  };
  const command = new GetObjectCommand(params);
  const { Body } = await s3.send(command);

  // handle what happens if object not present
  if (!Body) {
    throw new Error(`Object not found in s3://${bucket_name}/${key}`);
  }

  const stream = Body as Readable;
  // convert the stream into a string
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
};
