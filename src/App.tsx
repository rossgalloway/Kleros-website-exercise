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

export function App() {
  const { isConnected } = useAccount()
  const { retrievedWalletBalances, retrievedBadgeTokens } = useTokens()

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
          {isConnected && !retrievedWalletBalances && <GetBalances />}
          <SendWidget />
        </Flex>
        <Footer />
      </Flex>
    </>
  )
}
