// src/App.tsx
import { Flex } from '@radix-ui/themes'
import React, { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAccount } from 'wagmi'

import Footer from './components/footer'
import Header from './components/header'
import SendWidget from './components/sendWidget'
import { useDappContext } from './contexts/dAppContext'
import { useQueryKlerosTokens } from './hooks/useQueryKlerosTokens'
import Logger from './components/Logger'
import BalanceFetcher from './components/BalanceFetcher'

export function App() {
  const { isConnected, address } = useAccount()
  const {
    setRetrievedWalletBalances,
    retrievedBadgeTokens,
    setRetrievedBadgeTokens
  } = useDappContext()
  // const { refetchErcBalances, refetchEthBalance } = useGetBalances()
  const { refetchBadgeData } = useQueryKlerosTokens()

  useEffect(() => {
    if (!retrievedBadgeTokens) {
      refetchBadgeData()
      setRetrievedBadgeTokens(true)
    }
  }, [retrievedBadgeTokens, refetchBadgeData, setRetrievedBadgeTokens])

  // useEffect(() => {
  //   if (isConnected) {
  //     setRetrievedWalletBalances(false)
  //   }
  // }, [isConnected])

  const prevAddress = useRef(address)
  useEffect(() => {
    if (prevAddress.current !== address) {
      setRetrievedWalletBalances(false)
      prevAddress.current = address
    }
  }, [address, setRetrievedWalletBalances])

  return (
    <>
      <Toaster position="bottom-right" />
      <Logger />
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

// useEffect(() => {
//   if (
//     isConnected &&
//     !retrievedWalletBalances &&
//     retrievedBadgeTokens &&
//     address
//   ) {
//     console.log(
//       'fetching wallet balances ',
//       address,
//       isConnected,
//       retrievedWalletBalances,
//       retrievedBadgeTokens
//     )
//     refetchEthBalance()
//     refetchErcBalances()
//   }
// }, [
//   address,
//   isConnected,
//   retrievedWalletBalances,
//   retrievedBadgeTokens,
//   refetchEthBalance,
//   refetchErcBalances,
//   setRetrievedWalletBalances
// ])
