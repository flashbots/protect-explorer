# Protect Explorer

A simple one page website to display the data from Flashbots Protect in order to better illuminate the function it fulfills and who uses it.

## Getting Started

You'll need to change `.env.template` to `.env` and update the values for the various API keys. You should be able to get Alchemy (used for ENS name resolution), CryptoCompare (used for historical ETH<>USD prices) and Dune API (used for top level metrics) keys for free. 

You will not be able to access the data required to work on the Leaderboard component, but everything else should work well locally. 

Once your environment is set, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
