
import { NextRequest} from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const workspaceSid = process.env.TWILIO_WORKSPACE_SID || '';
const workflowSid = process.env.TWILIO_WORKFLOW_SID;
const client = require('twilio')(accountSid, authToken);



export async function POST(req: NextRequest ) {
    try {
        const resp = await client.taskrouter.v1.workspaces(workspaceSid).tasks.create({
          workflowSid,
        });
  
        return new Response(JSON.stringify(resp), { status: 200 });
      } catch (error) {
        return new Response("something went wrong", { status: 500});
      }
   
}
