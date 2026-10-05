# Checkout Champion

A React and Vite game for guessing Steam game prices.

## Local development

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and set `RAWG_KEY` to your RAWG API key.
3. Run `npm run dev`.

The Vite development server runs `/api/game-details` locally. The frontend never
reads the key. Restart the development server after changing the key.

## Vercel deployment

Import the repository as a Vite project, with `npm run build` and output directory
`dist`. Vercel deploys `api/game-details.js` as a server function automatically.

In project environment variables, add **RAWG_KEY** for Production and Preview.
Remove the old **VITE_RAWG_KEY**, then deploy this branch or merge it into main.
If a previous deployment exposed the old key, rotate it and use the replacement.

The endpoint only accepts GET requests with one title of at most 300 characters.
Successful responses are cached by the deployment CDN for one hour, with stale
responses allowed while refreshing. Upstream failures aren't cached. This keeps
the key private but does not make the endpoint private or impose a global request
limit; configure Vercel Firewall rate limits if public traffic needs that protection.

`npm run preview` serves the static build only, without the API function. Test the
complete app with `npm run dev` or a Vercel preview deployment.

## Checks

- `npm run lint`
- `npm run build`
- `node --test tests/game-details.test.js`
