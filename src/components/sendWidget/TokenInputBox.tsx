// TokenInputBox.tsx
import React from 'react'
import { TextField, Text, Flex } from '@radix-ui/themes'
import { useAccount } from 'wagmi'
import TokenSelectorDialog from './TokenSelectorDialog'
import { useSendWidgetContext } from './sendWidgetContext'

export function TokenInputBox() {
  const { isConnected } = useAccount()
  const {
    tokenQtyInputValue,
    setTokenQtyInputValue,
    setFormattedTokenQty,
    selectedToken
  } = useSendWidgetContext()

  const handleTokenQtyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formattedValue = BigInt(
      Number(e.target.value) * 10 ** Number(selectedToken.decimals)
    )
    if (isConnected) {
      setTokenQtyInputValue(e.target.value)
      setFormattedTokenQty(formattedValue)
    }
  }

  return (
    <Flex className="token-input-box" direction="column" gap="3">
      <Flex className="token-input-element" justify="center">
        <Text className="mini-title">Send:</Text>

        <TextField.Input
          className="token-input-text"
          size="3"
          radius="none"
          placeholder="0.0"
          style={{ textAlign: 'start' }}
          value={tokenQtyInputValue}
          onChange={handleTokenQtyInputChange}
        />
        <TokenSelectorDialog />
      </Flex>
      <Flex className="balance-info">
        <Text
          size="1"
          style={{
            fontWeight: '500',
            color: '#717171'
          }}
        >
          Balance:
          {!isNaN(Number(selectedToken?.balance)) &&
          selectedToken?.balance !== undefined
            ? ` ${(
                Number(selectedToken.balance) /
                10 ** Number(selectedToken.decimals)
              ).toFixed(5)} ${selectedToken?.ticker}`
            : null}
        </Text>
      </Flex>
    </Flex>
  )
}
