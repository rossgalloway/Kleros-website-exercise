import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import { Button, Flex } from '@radix-ui/themes'

function Header() {
  const { isConnected } = useAccount()

  return (
    <Flex className="header" direction="row" align="center">
      <h1 className="header-title">Token Transporter</h1>
      <ConnectButton />
    </Flex>
  )
}

export default Header
