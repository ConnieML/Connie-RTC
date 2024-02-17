import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
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

export const getObject = async (key: string) => {
  const params = {
    Bucket: bucket_name,
    Key: key,
  };
  const command = new GetObjectCommand(params);
  const { Body } = await s3.send(command);
  return Readable.from(Body).toString();
};

