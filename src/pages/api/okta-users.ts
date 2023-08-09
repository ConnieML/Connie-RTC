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
  // if (method === 'POST') {
  //   const oktaUser = JSON.parse(req.body)
  //   await updateOktaUser(oktaUser)
  //   res.status(200).json({ oktaUser })
  // }
}

// Get a list of Okta users via axios
async function getOktaUsers() {
  try {
    const response = await axios.get(
      `https://portal.connie.contact/api/v1/users`,
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
