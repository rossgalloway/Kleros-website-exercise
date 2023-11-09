import { Flex } from '@radix-ui/themes'
import React, { useEffect, useRef, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAccount } from 'wagmi'

import Footer from './components/footer'
import { GetBalances } from './components/GetBalances'
import Header from './components/header'
import { QueryKlerosTokens } from './components/kleros/QueryKlerosTokens'
import SendWidget from './components/sendWidget'
import {
  useFlushSendWidget,
  useFlushWalletChange
} from './components/sendWidget/sendWidgetHooks'
import { useTokens } from './contexts/tokenContext'

export function App() {
  const { isConnected, address } = useAccount()
  const [isWalletChanged, setIsWalletChanged] = useState(false)
  const {
    retrievedWalletBalances,
    setRetrievedWalletBalances,
    retrievedBadgeTokens
  } = useTokens()

  const prevAddress = useRef(address)
  useEffect(() => {
    if (prevAddress.current !== address) {
      setRetrievedWalletBalances(false)
      setIsWalletChanged(true)
      prevAddress.current = address
    }
  }, [address])

  useFlushSendWidget()
  useFlushWalletChange(isWalletChanged, setIsWalletChanged)

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
