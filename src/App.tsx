import React from 'react'
import { useAccount } from 'wagmi'
import { GetBalances } from './components/getBalances'
import { QueryKlerosTokens } from './components/kleros/QueryKlerosTokens'
import { Flex } from '@radix-ui/themes'
import { Toaster } from 'react-hot-toast'
import Header from './components/header'
import SendWidget from './components/sendWidget'
import Footer from './components/footer'
import { useTokens } from './contexts/tokenContext'
import {
  useFlushSendWidget,
  useFlushWalletChange
} from './components/sendWidget/sendWidgetHooks'

export function App() {
  const { isConnected, address } = useAccount()
  const {
    retrievedWalletBalances,
    setRetrievedWalletBalances,
    retrievedBadgeTokens
  } = useTokens()

  const prevAddress = React.useRef(address)
  if (prevAddress.current !== address) {
    setRetrievedWalletBalances(false)
    prevAddress.current = address
  }
  useFlushSendWidget()
  useFlushWalletChange()

  return (
    <>
      <Toaster position="bottom-right" />
      <Flex
        className="app-container"
        direction="column"
        justify="center"
        align="center"
      >
        <Header />
        <Flex
          className="widgetContainer"
          align="center"
          justify="center"
          direction="column"
        >
          {!retrievedBadgeTokens && <QueryKlerosTokens />}
          {isConnected && !retrievedWalletBalances && retrievedBadgeTokens && (
            <GetBalances />
          )}
          <SendWidget />
        </Flex>
        <Footer />
      </Flex>
    </>
  )
}
