## Getting Started

Install [pnpm](https://pnpm.io/installation)

(For example, using homebrew:)
```
brew install pnpm
```

Install dependencies, then run the dev server. 

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More
### Next.js
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Why pnpm?
We chose to use pnpm for its improved security over npm, and also its improved package management speed compared to yarn. Read more [here](https://hackernoon.com/choosing-the-right-package-manager-npm-yarn-or-pnpm). 

### Deployment

This project has been integrated with the AWS amplify github app for automatic deployments. All commits and pull requests to the ```develop``` branch have been set up for automatic deployment. Deployment and build settings should be edited through the AWS Amplify [console](https://console.aws.amazon.com/amplify/home) and through associated [documentation](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html). 

Deployment build setting specifications:
* Changed node version to 20 to be compatible with building next.js applications to fulfil requirement >=18.17.0
* Changed container image to be Amazon linux 2023 to solve [GLIBC_2.28 not found](https://stackoverflow.com/questions/72921215/getting-glibc-2-28-not-found) error after upgrading node version.
* Added npmrc file as a linker between pnpm and npm because amplify does some part of its installation using npm [here](https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html#turborepo-pnpm-monorepo-configuration).
* Since repository is public, AWS amplify app has no linked IAM service roles for [security purposes](https://docs.aws.amazon.com/amplify/latest/userguide/pr-previews.html) to enable pull request previews. 
