import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// API handler that returns a list of Okta users for GET requests and edit a user for POST requests
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  if (method === 'GET') {
    const oktaUsers = await getOktaUsers()
    res.status(200).json({ oktaUsers })
  }
  if (method === 'POST') {
    const oktaUser = req.body
    await updateOktaUser(oktaUser)
    res.status(200).json({ oktaUser })
  }
}

async function updateOktaUser(oktaUser: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_OKTA_URL}/api/v1/users/${oktaUser.id}`,
      {
        profile: {
          firstName: oktaUser.firstName,
          lastName: oktaUser.lastName,
          email: oktaUser.email,
          login: oktaUser.email,
          userType: oktaUser.role,
        },
      },
      {
        headers: {
          Authorization: `SSWS ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    )
    return response.data
  }
  catch (error) {
    console.error(error)
  }
}

async function getOktaUsers() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_OKTA_URL}/api/v1/users`,
      {
        headers: {
          Authorization: `SSWS ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    )
    return response.data
  }
  catch (error) {
    console.error(error)
  }
}
