import React from 'react'
import { Flex } from '@radix-ui/themes'
import { TokenInputBox } from './TokenInputBox'
import { AddressInputBox } from './AddressInputBox'
import { SendButton } from './SendButton'
import {
  useCheckSufficientBalance,
  useTokenQtyReset,
  useValidateAddress,
  useCheckEnsAddress
} from './sendWidgetHooks'

export function SendWidget() {
  useValidateAddress()
  useCheckEnsAddress()
  useTokenQtyReset()
  useCheckSufficientBalance()

  return (
    <Flex
      className="sendWidget"
      direction="column"
      align="center"
      justify="between"
      gap="3"
    >
      <Flex
        className="input-container"
        direction="column"
        align="center"
        gap="3"
      >
        <TokenInputBox />
        <AddressInputBox />
      </Flex>
      <SendButton />
    </Flex>
  )
}

export default SendWidget
