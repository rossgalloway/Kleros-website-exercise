import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'

import { App } from './App'
import { chains, config } from './wagmi'

import { Theme, ThemePanel } from '@radix-ui/themes'
import { TokenProvider } from './contexts/tokenContext'
import '@radix-ui/themes/styles.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <TokenProvider>
          <Theme accentColor="gray" radius="full">
            <App />
            {/* <ThemePanel /> */}
          </Theme>
        </TokenProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
