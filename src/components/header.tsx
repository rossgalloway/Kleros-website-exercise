import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Flex } from '@radix-ui/themes'

function Header() {
  return (
    <Flex className="header" direction="row" align="center">
      <h1 className="header-title">Token Transporter</h1>
      <Flex gap="5">
        <ConnectButton />
      </Flex>
    </Flex>
  )
}

export default Header
