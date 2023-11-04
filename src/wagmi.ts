import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

//Todo: do I hide this in a .env file?
const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, ...(import.meta.env?.MODE === 'development' ? [goerli] : [])],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY }),
    publicProvider()
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Kleros Exercise',
  chains,
  projectId: walletConnectProjectId
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
})

export { chains }
