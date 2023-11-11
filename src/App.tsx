import { Flex } from '@radix-ui/themes'
import React, { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAccount } from 'wagmi'

import Footer from './components/footer'

import Header from './components/header'
import SendWidget from './components/sendWidget'
import { useTokens } from './contexts/tokenContext'
import { useGetBalances } from './hooks/useGetBalances'
import { useQueryKlerosTokens } from './hooks/useQueryKlerosTokens'

export function App() {
  const { isConnected, address } = useAccount()
  const {
    retrievedWalletBalances,
    setRetrievedWalletBalances,
    retrievedBadgeTokens,
    setRetrievedBadgeTokens
  } = useTokens()
  const { refetchErcBalances, refetchEthBalance } = useGetBalances()
  const { refetchBadgeData } = useQueryKlerosTokens()

  if (!retrievedBadgeTokens) {
    refetchBadgeData()
    setRetrievedBadgeTokens(true)
  }

  if (isConnected && !retrievedWalletBalances && retrievedBadgeTokens) {
    console.log('refetching balances')
    refetchEthBalance()
    refetchErcBalances()
    setRetrievedWalletBalances(true)
  }

  const prevAddress = useRef(address)
  useEffect(() => {
    if (prevAddress.current !== address) {
      setRetrievedWalletBalances(false)
      prevAddress.current = address
    }
  }, [address])

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
          <SendWidget />
        </Flex>
        <Footer />
      </Flex>
    </>
  )
}
