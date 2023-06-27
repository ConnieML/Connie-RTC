import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '@/lib/twilioClient'

/* Dev notes:
Resources: 
- https://www.twilio.com/docs/taskrouter/api/event
- https://www.twilio.com/docs/taskrouter/api/event/reference
- https://www.twilio.com/docs/sync/api/map-resource
*/

// This API serves as the Callback Event URL for Twilio TaskRouter, called each time an Event takes place
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }

    // Respond with no content as recommended by https://www.twilio.com/docs/taskrouter/api/event/reference
    res.setHeader('Content-Type', 'application/json');
    res.status(204).end()
}