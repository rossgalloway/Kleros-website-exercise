import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Flex } from '@radix-ui/themes'

import { Account } from './components/wagmi/Account'
import { Balance } from './components/wagmi/Balance'
import { BlockNumber } from './components/wagmi/BlockNumber'
import { NetworkSwitcher } from './components/wagmi/NetworkSwitcher'
import { ReadContract } from './components/wagmi/ReadContract'
import { ReadContracts } from './components/wagmi/ReadContracts'
import { ReadContractsInfinite } from './components/wagmi/ReadContractsInfinite'
import { SendTransaction } from './components/wagmi/SendTransaction'
import { SendTransactionPrepared } from './components/wagmi/SendTransactionPrepared'
import { SignMessage } from './components/wagmi/SignMessage'
import { SignTypedData } from './components/wagmi/SignTypedData'
import { Token } from './components/wagmi/Token'
import { WatchContractEvents } from './components/wagmi/WatchContractEvents'
import { WatchPendingTransactions } from './components/wagmi/WatchPendingTransactions'
import { WriteContract } from './components/wagmi/WriteContract'
import { WriteContractPrepared } from './components/wagmi/WriteContractPrepared'
import Header from './components/header'
import Footer from './components/footer'
import SendWidget from './components/sendWidget'
import { QueryBadges } from './components/kleros/getKlerosData'
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
      {isConnected && (
        <Flex
          className="widgetContainer"
          align="center"
          justify="center"
          direction="column"
        >
          <SendWidget />
          <QueryBadges />
        </Flex>
      )}
      <Footer />
      {/* <Flex direction="column" align="center">
        <h1>wagmi + RainbowKit + Vite</h1>

        <ConnectButton />
        {isConnected && (
          <>
            <hr />
            <h2>Network</h2>
            <NetworkSwitcher />
            <br />
            <hr />
            <h2>Account</h2>
            <Account />
            <br />
            <hr />
            <h2>Balance</h2>
            <Balance />
            <br />
            <hr />
            <h2>Block Number</h2>
            <BlockNumber />
            <br />
            <hr />
            <h2>Read Contract</h2>
            <ReadContract />
            <br />
            <hr />
            <h2>Read Contracts</h2>
            <ReadContracts />
            <br />
            <hr />
            <h2>Read Contracts Infinite</h2>
            <ReadContractsInfinite />
            <br />
            <hr />
            <h2>Send Transaction</h2>
            <SendTransaction />
            <br />
            <hr />
            <h2>Send Transaction (Prepared)</h2>
            <SendTransactionPrepared />
            <br />
            <hr />
            <h2>Sign Message</h2>
            <SignMessage />
            <br />
            <hr />
            <h2>Sign Typed Data</h2>
            <SignTypedData />
            <br />
            <hr />
            <h2>Token</h2>
            <Token />
            <br />
            <hr />
            <h2>Watch Contract Events</h2>
            <WatchContractEvents />
            <br />
            <hr />
            <h2>Watch Pending Transactions</h2>
            <WatchPendingTransactions />
            <br />
            <hr />
            <h2>Write Contract</h2>
            <WriteContract />
            <br />
            <hr />
            <h2>Write Contract (Prepared)</h2>
            <WriteContractPrepared />
          </>
        )}
      </Flex> */}
    </Flex>
  )
}
