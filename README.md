# Code Sage AI - Deployment Instructions

## Recent Changes

We've made several changes to improve the deployment process and address the issue with the missing routes-manifest.json file:

1. Updated `package.json` with new scripts:
   - Added a `vercel-build` script that runs linting before building.
   - Added a `postinstall` script to ensure the project is built after dependencies are installed.

2. Updated `vercel.json` with more specific configurations:
   - Specified the use of the custom `vercel-build` command.
   - Added environment variable configurations.

3. Updated `next.config.mjs` with additional configurations:
   - Enabled `reactStrictMode`.
   - Added experimental `serverActions` support.
   - Included a `rewrites` function for API routes.

## Deployment Steps

To deploy this project on Vercel:

1. Ensure all changes are committed and pushed to your GitHub repository.

2. Log in to your Vercel account and navigate to your project.

3. If you're creating a new deployment:
   - Click "Add New" > "Project"
   - Select the repository containing this project
   - Vercel should automatically detect it as a Next.js project

4. In the project settings, ensure the following environment variables are set:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `OPENAI_API_KEY`
   - `CLERK_SECRET_KEY`

5. Deploy the project.

6. Once the deployment is complete, Vercel will provide you with a URL to access your application.

If you encounter any issues during deployment, check the build logs in the Vercel dashboard for error messages or warnings.

## Local Development

To run the project locally:

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Troubleshooting

If you continue to encounter issues with the routes-manifest.json file, try the following:

1. Clear the Vercel project cache and redeploy.
2. Ensure all environment variables are correctly set in the Vercel project settings.
3. Check that the project's dependencies are up to date, especially Next.js and related packages.

If problems persist, review the Vercel build logs for any specific error messages or warnings that may provide additional insight into the issue.
