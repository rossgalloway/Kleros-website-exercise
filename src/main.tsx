import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'

import { Theme } from '@radix-ui/themes'
import { App } from './App'
import { chains, config } from './wagmi'

import { TokenProvider } from './contexts/tokenContext'
import '@radix-ui/themes/styles.css'
import './index.css'
import { SendWidgetProvider } from './components/sendWidget/sendWidgetContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        showRecentTransactions={true}
      >
        <TokenProvider>
          <SendWidgetProvider>
            <Theme accentColor="gray" radius="full">
              <App />
            </Theme>
          </SendWidgetProvider>
        </TokenProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
