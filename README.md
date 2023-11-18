# Token Transporter

Send ETH and ERC-20 tokens with ease! This dapp filters wallet tokens for those that are included in Kleros' Token Curated Registry and have the ERC-20 badge. So if you are wondering why some of your tokens don't show up, that is why. V2 may allow for browsing the full registry or importing other token lists.

App is not responsive for mobile, sorry!

This project is experimental and in beta. Use at your own risk.

project is deployed at: <https://kleros-website-exercise-fdij2zsep-rossgalloway.vercel.app/>

This is a [wagmi](https://wagmi.sh) + [RainbowKit](https://rainbowkit.com) + [Vite](https://vitejs.dev/) project bootstrapped with [`create-wagmi`](https://github.com/wagmi-dev/wagmi/tree/main/packages/create-wagmi)

# Getting Started

If you want to run the project locally you can fork the repo. You will need to rename the `.env.example` file to `.env` and enter valid API keys. You can adjust what API providers you use and fall back to in the `wagmi.ts` file.

type `npm install` in your terminal to install, and  `npm run dev` to run the dApp, and then open [localhost:5173](http://localhost:5173) in your browser.
