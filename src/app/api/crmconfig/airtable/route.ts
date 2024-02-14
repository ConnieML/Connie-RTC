import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { putObject } from '../../../../lib/aws/s3';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const { body } = req.body;
    const key = `crm_airtable:${session.user.id}`;
    await putObject(key, body);
    res.status(200).send('Success');
  } catch (error) {
    res.status(500).send('Error');
  }
};