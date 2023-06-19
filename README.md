# Connie-RTC
Phase 1 of the Connie CPaaS Prototype

## Local setup instructions
1. Fork this repo
2. Clone your forked repo to your local machine
3. Install packages and dependencies: `yarn`
4. Create a `.env` file in the root directory and add the following:
```zsh
TWILIO_ACCOUNT_SID="Enter your twilio account sid here"
TWILIO_AUTH_TOKEN="Enter your twilio auth token here"
NEXT_PUBLIC_URL="http://localhost:3000"
```
5. Start the development server: `npm run dev`