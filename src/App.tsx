// src/App.tsx
import { Flex } from '@radix-ui/themes'
import React, { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAccount, useNetwork } from 'wagmi'

import Footer from './components/footer'
import Header from './components/header'
import SendWidget from './components/sendWidget'
import { useDappContext } from './contexts/dAppContext'
import BalanceFetcher from './components/utilities/BalanceFetcher'
import TokenFetcher from './components/utilities/TokenFetcher'
// import Logger from './components/Logger'

export function App() {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { setRetrievedWalletBalances, retrievedBadgeTokens } = useDappContext()

  const prevAddress = useRef(address)
  useEffect(() => {
    if (prevAddress.current !== address) {
      setRetrievedWalletBalances(false)
      prevAddress.current = address
    }
  }, [address, setRetrievedWalletBalances])

  useEffect(() => {
    setRetrievedWalletBalances(false)
  }, [chain?.id])

  return (
    <>
      <Toaster position="bottom-right" />
      {/* <Logger /> */}
      <TokenFetcher />
      {isConnected && retrievedBadgeTokens && <BalanceFetcher />}
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
          <SendWidget />
        </Flex>
        <Footer />
      </Flex>
    </>
  )
}
