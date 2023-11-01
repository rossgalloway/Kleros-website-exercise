import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Flex } from '@radix-ui/themes'
import Header from './components/header'
import Footer from './components/footer'
import SendWidget from './components/sendWidget'
import { QueryBadges } from './components/kleros/getKlerosData'
import GetBalances from './components/getBalances'

// import Scratch from './components/scratch'

export function App() {
  const { isConnected } = useAccount()

  return (
    <Flex
      className="app-container"
      direction="column"
      justify="center"
      align="center"
    >
      <Header />
      {isConnected && <GetBalances />}
      <Flex
        className="widgetContainer"
        align="center"
        justify="center"
        direction="column"
      >
        <SendWidget />
        <QueryBadges />
      </Flex>
      <Footer />
    </Flex>
  )
}
