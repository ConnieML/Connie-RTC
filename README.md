# Connie-RTC
Phase 1 of the Connie CPaaS Prototype

## Login Info

Login with your Okta credentials (message Cameron if you have trouble logging in)

Your user type is set inside of the Okta Admin (Message Cameron if you want your role changed for dev purposes)

## Local setup instructions
1. Fork this repo
2. Clone your forked repo to your local machine
3. Install packages and dependencies: `yarn --frozen-lockfile`
4. Create a `.env` file in the root directory and add the following:
```zsh
TWILIO_ACCOUNT_SID="Enter your twilio account sid here"
TWILIO_AUTH_TOKEN="Enter your twilio auth token here"
NEXT_PUBLIC_URL="http://localhost:3000"
```
5. Start the development server: `npm run dev`
