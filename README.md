# Connie-RTC
Phase 1 of the Connie CPaaS Prototype

## Login Info

Login with your Okta credentials (message Cameron if you have trouble logging in)

Your user type is set inside of the Okta Admin (Message Cameron if you want your role changed for dev purposes)

## Local setup instructions
1. Fork this repo
2. Clone your forked repo to your local machine
3. Install packages and dependencies: `yarn --frozen-lockfile`
4. Create a `.env` file in the root directory and fill in the below variables:
```zsh
NEXT_PUBLIC_URL="http://localhost:3000"
APP_URL="http://localhost:3000"

# Found at https://console.twilio.com/us1/account/keys-credentials/api-keys under "Live credentials"
TWILIO_ACCOUNT_SID="Enter your twilio account sid here"
TWILIO_AUTH_TOKEN="Enter your twilio auth token here"

# Found at https://console.twilio.com/us1/account/keys-credentials/api-keys under "API keys" as SID
# Create an API key if one doesn't exist. More instructions at https://www.twilio.com/docs/glossary/what-is-an-api-key
TWILIO_API_KEY="Enter your twilio api key here"
# When you create the API key, you’ll be shown its secret, which is the variable below
# For security, you will only be shown the secret at this time so store it in a secure location
TWILIO_API_SECRET="Enter your twilio api secret here"

# Found at https://www.twilio.com/console/sync/services
TWILIO_SYNC_SERVICE_SID="Enter your twilio sync service sid here"

NEXT_PUBLIC_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"

NEXT_PUBLIC_WORKSPACE_SID="Your workspace sid"

NEXT_PUBLIC_OKTA_URL='https://trial-2094636.okta.com'

# Slack message Cameron For the following:
NEXT_PUBLIC_TOKEN=""
OKTA_OAUTH2_ISSUER=""
OKTA_OAUTH2_CLIENT_ID=""
OKTA_OAUTH2_CLIENT_SECRET=""
SECRET=""

```
5. Start the development server: `npm run dev`
6. Run `ngrok http 3000` to expose your local server to the internet
7. Copy the ngrok's forwarding URL, which looks like this `https://<random-string>.ngrok-free.app`
8. Go to the Twilio console > [TaskRouter Workspaces](https://console.twilio.com/us1/develop/taskrouter/workspaces?frameUrl=/console/taskrouter/workspaces) > select the workspace you want to use > Settings
9. Paste the ngrok URL into the `Assignment Callback URL` field, append `/api/queuesStats` to the end of the URL, and click Save