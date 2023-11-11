// TokenInputBox.tsx
import React, { useEffect, useState } from 'react'
import { TextField, Text, Flex } from '@radix-ui/themes'
import { useAccount } from 'wagmi'
import { useTokens } from '../../contexts/tokenContext'
import { TokenData } from '../../types/tokenListTypes'
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
  const { listTokens, retrievedWalletBalances } = useTokens()
  const [displayedBalance, setDisplayedBalance] = useState(0)

  const handleTokenQtyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value

    // Handle the case when the input is empty
    if (inputValue === '') {
      setTokenQtyInputValue('')
      setFormattedTokenQty(BigInt(0)) // or whatever your default state should be
      return
    }

    // Parse the input value as a floating-point number
    const numericValue = parseFloat(inputValue)

    // Convert selectedToken.decimals to a regular number
    const decimals = Number(selectedToken.decimals)

    // Convert the value to the token's smallest unit and then to BigInt
    if (!isNaN(numericValue) && !isNaN(decimals)) {
      const factor = Math.pow(10, decimals)
      const formattedValue = BigInt(Math.round(numericValue * factor))

      setTokenQtyInputValue(inputValue)
      setFormattedTokenQty(formattedValue)
    }
  }

  useEffect(() => {
    setTokenQtyInputValue('')
    setFormattedTokenQty(0n)
  }, [selectedToken, setTokenQtyInputValue, setFormattedTokenQty])

  useEffect(() => {
    const handleLoad = () => {
      const formattedValue = formatTokenBalance(selectedToken)
      setDisplayedBalance(formattedValue)
    }

    // Run the handler right away in case the component mounts after the load event
    handleLoad()

    // Set up the event listener for future page loads
    window.addEventListener('load', handleLoad)

    // Make sure to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [retrievedWalletBalances, selectedToken, listTokens])

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
          disabled={!isConnected}
        />
        <TokenSelectorDialog />
      </Flex>
      <Flex className="balance-info">
        {isConnected && (
          <Text
            size="1"
            className="info-text"
            // style={{
            //   fontWeight: '500',
            //   color: '#717171'
            // }}
          >
            {'Balance: '}
            {displayedBalance}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

function formatTokenBalance(selectedToken: TokenData) {
  let formattedValue: number
  if (selectedToken) {
    formattedValue = Number(
      (
        Number(selectedToken.balance) /
        10 ** Number(selectedToken.decimals)
      ).toFixed(5)
    )
  } else {
    formattedValue = 0
  }
  return formattedValue
}
