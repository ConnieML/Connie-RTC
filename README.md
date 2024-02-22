# Connie

## Development

This project uses pnpm as its package manager. Make sure is it [installed](https://pnpm.io/installation)
before continuing.

#### Aside: Why pnpm?

We chose to use pnpm for its improved security over npm, and also its improved
package management speed compared to yarn. Read more [here](https://hackernoon.com/choosing-the-right-package-manager-npm-yarn-or-pnpm).

Create a configuration file for your application by copying the .env.example and
edit the .env file with the appropriate values:

```bash
cp .env.example .env
```

Install dependencies, then run the dev server.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

### Format

Before committing, make sure to format your code with the following command:

```bash
pnpm format
```

### Environment Setup

#### Environment Variables

Create a .env file at the root of the repository with the following variables:
NEXTAUTH_URL=http://localhost:3000
OKTA_OAUTH2_CLIENT_ID={OKTA APPLICATION CLIENT ID}
OKTA_OAUTH2_CLIENT_SECRET={OKTA APPLICATION SECRET}
OKTA_OAUTH2_ISSUER=https://{YOUR OKTA ACCOUNT URL (click top right and it will appear below your email)}
SECRET=Some long random string

## Deployment

View the latest deployment branch [here](https://develop.d2r9j66448p933.amplifyapp.com/).

This project has been integrated with the AWS amplify github app for automatic deployments. All commits and pull requests to the `develop` branch have been set up for automatic deployment. Deployment and build settings should be edited through the AWS Amplify [console](https://console.aws.amazon.com/amplify/home) and through associated [documentation](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html).

Deployment build setting specifications:

- Changed node version to 20 to be compatible with building next.js applications to fulfil requirement >=18.17.0
- Changed container image to be Amazon linux 2023 to solve [GLIBC_2.28 not found](https://stackoverflow.com/questions/72921215/getting-glibc-2-28-not-found) error after upgrading node version.
- Added npmrc file as a linker between pnpm and npm because amplify does some part of its installation using npm [here](https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html#turborepo-pnpm-monorepo-configuration).
- Since repository is public, AWS amplify app has no linked IAM service roles for [security purposes](https://docs.aws.amazon.com/amplify/latest/userguide/pr-previews.html) to enable pull request previews.
