# Toolora

The internet's premium toolbox containing high-performance, private-by-default tools for everyone.

## Google Analytics 4 (GA4) Configuration

We use the official Next.js package `@next/third-parties/google` to integrate Google Analytics 4.

### Local Configuration

1. Create a `.env.local` file in the root directory (if it does not exist) and add your Measurement ID:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TP3JZ6WCNB
   ```
2. Google Analytics is configured to load **only in production** (`NODE_ENV === 'production'`) and if the environment variable is provided. It will not render during development.

### Vercel Deployment

To configure Google Analytics on Vercel:
1. Navigate to your project on the Vercel Dashboard.
2. Go to **Settings** > **Environment Variables**.
3. Add the following environment variable:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-TP3JZ6WCNB` (or your tracking ID)
4. Save and trigger a new deployment for the changes to take effect.
