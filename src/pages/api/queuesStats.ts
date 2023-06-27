import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from 'twilio'

/* Dev notes:
Resources: 
- https://www.twilio.com/docs/taskrouter/api/event
- https://www.twilio.com/docs/taskrouter/api/event/reference
- https://www.twilio.com/docs/sync/api/map-resource

TODOs: 
- "respond to Event Callbacks with 204 No Content and a Content-Type header of application/json within 15 seconds"
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
}