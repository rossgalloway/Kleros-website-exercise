// TokenInputBox.tsx
import React, { useEffect, useState } from 'react'
import { TextField, Text, Flex } from '@radix-ui/themes'
import { useAccount } from 'wagmi'
// import { useTokens } from '../../contexts/tokenContext'
import { TokenData, TokenDataArray } from '../../types/tokenListTypes'
import TokenSelectorDialog from './TokenSelectorDialog'
import { useSendWidgetContext } from '../../contexts/sendWidgetContext'
import { useCheckSufficientBalance } from '../../hooks/sendWidgetHooks'
import { useTokens } from '../../contexts/tokenContext'

export function TokenInputBox() {
  const { isConnected } = useAccount()
  const {
    tokenQtyInputValue,
    setTokenQtyInputValue,
    setFormattedTokenQty,
    selectedToken
  } = useSendWidgetContext()
  useCheckSufficientBalance()
  console.log('selectedToken: ', selectedToken)

  const { displayedBalance } = useTokenInputLogic()

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

    const numericValue = parseFloat(inputValue)
    const decimals = Number(selectedToken.decimals)

    if (!isNaN(numericValue) && !isNaN(decimals)) {
      const factor = Math.pow(10, decimals)
      const formattedValue = BigInt(Math.round(numericValue * factor))

      setTokenQtyInputValue(inputValue)
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
          disabled={!isConnected}
        />
        <TokenSelectorDialog />
      </Flex>
      <Flex className="balance-info">
        {isConnected && (
          <Text size="1" className="info-text">
            {'Balance: '}
            {displayedBalance}
          </Text>
          /*TODO: add send max button here*/
        )}
      </Flex>
    </Flex>
  )
}

export function useTokenInputLogic() {
  const { selectedToken } = useSendWidgetContext()
  const { listTokens, retrievedWalletBalances } = useTokens()
  const [displayedBalance, setDisplayedBalance] = useState(0)

  useEffect(() => {
    const formattedValue = formatTokenBalance(selectedToken, listTokens)
    setDisplayedBalance(formattedValue)
  }, [retrievedWalletBalances, selectedToken, listTokens])

  return { displayedBalance }
}

function formatTokenBalance(
  selectedToken: TokenData,
  listTokens: TokenDataArray
) {
  let formattedValue = 0
  if (selectedToken) {
    const token = listTokens.find(
      (t) => t !== undefined && t.addr === selectedToken.addr
    )
    if (token && token.balance) {
      formattedValue = Number(
        (Number(token.balance) / Math.pow(10, Number(token.decimals))).toFixed(
          5
        )
      )
    }
  }
  return formattedValue
}
