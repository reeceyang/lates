# lates

Request lates and plan menus for [Xi](https://xi.mit.edu/) house dinners.

Features:

- Add dishes to menus. The app will try to automatically infer tags from the name of the dish. You can also customize the tags manually and add a text description to the menu.

- Request lates by selecting dishes from the menu and specifying additional preferences.

- Name and late preferences are saved to browser localStorage.

- View and create menus and lates for past and future dates.

- Mark lates as cancelled or fulfilled. Edit all dishes and lates after creating them.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). The project uses [Convex](https://www.convex.dev/), a serverless database framework, for the backend and the [Joy UI](https://mui.com/joy-ui/getting-started/) component library on the frontend. [Day.js](https://day.js.org/) provides date and time utilities.

## Develop

Install dependencies using [pnpm](https://pnpm.io/installation):

```bash
pnpm install
```

To set up Convex, run:

```bash
pnpm convex dev
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Contains the only page in the app (so far)
- `/components`: React components for displaying and editing Meals, Lates, and Dishes
- `/utils`: scripts for the autotagging functionality
- `/convex`: Convex serverless functions and database schema

## Deploy

The app is deployed on Vercel. View the [Convex documentation](https://docs.convex.dev/production/hosting/vercel) for instructions on how to deploy a Convex app to Vercel.
