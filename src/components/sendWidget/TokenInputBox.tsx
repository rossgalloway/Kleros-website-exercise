// TokenInputBox.tsx
import React, { useEffect, useState } from 'react'
import { TextField, Text, Flex } from '@radix-ui/themes'
import { useAccount } from 'wagmi'
import { TokenData, TokenDataArray } from '../../types/tokenListTypes'
import { useSendWidgetContext } from '../../contexts/sendWidgetContext'
import { useDappContext } from '../../contexts/dAppContext'
import TokenSelectorDialog from './TokenSelectorDialog'

export function TokenInputBox() {
  const { isConnected } = useAccount()
  const {
    tokenQtyInputValue,
    selectedToken,
    formattedTokenQty,
    setTokenQtyInputValue,
    setFormattedTokenQty,
    setIsValidValueInput,
    setIsSufficientBalance
  } = useSendWidgetContext()
  const { listTokens } = useDappContext()
  const { displayedBalance } = useTokenInputLogic()

  const handleTokenQtyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value
    validateValueInput(
      inputValue,
      selectedToken,
      formattedTokenQty,
      setTokenQtyInputValue,
      setFormattedTokenQty,
      setIsValidValueInput,
      setIsSufficientBalance
    )
  }
  const handleMaxClick = () => {
    if (selectedToken && selectedToken.balance) {
      setFormattedTokenQty(selectedToken.balance)
      setTokenQtyInputValue(
        (
          Number(selectedToken.balance) /
          Math.pow(10, Number(selectedToken.decimals))
        ).toString()
      )
    }
  }

  useEffect(() => {
    validateValueInput(
      tokenQtyInputValue,
      selectedToken,
      formattedTokenQty,
      setTokenQtyInputValue,
      setFormattedTokenQty,
      setIsValidValueInput,
      setIsSufficientBalance
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTokens, isConnected, selectedToken])

  useEffect(() => {
    if (selectedToken?.balance) {
      if (formattedTokenQty > selectedToken?.balance) {
        setIsSufficientBalance(false)
      } else {
        setIsSufficientBalance(true)
      }
    }
  }),
    [tokenQtyInputValue]

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
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Text
              size="1"
              className="info-text"
              style={{ marginRight: '10px' }}
            >
              {'Balance: '}
              {displayedBalance}
            </Text>
            <button className="max-button" onClick={handleMaxClick}>
              <Text size="1" className="info-text" align="center">
                {'max'}
              </Text>
            </button>
          </div>
        )}
      </Flex>
    </Flex>
  )
}

export function useTokenInputLogic() {
  const { selectedToken } = useSendWidgetContext()
  const { listTokens, retrievedWalletBalances } = useDappContext()
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
  if (selectedToken && listTokens) {
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

function validateValueInput(
  inputValue: string,
  selectedToken: TokenData,
  formattedTokenQty: bigint,
  setTokenQtyInputValue: React.Dispatch<React.SetStateAction<string>>,
  setFormattedTokenQty: React.Dispatch<React.SetStateAction<bigint>>,
  setIsValidValueInput: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSufficientBalance: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!selectedToken) return
  const decimals = Number(selectedToken.decimals)

  // Handle the case when the input is empty
  if (inputValue === '') {
    setTokenQtyInputValue('')
    setFormattedTokenQty(BigInt(0))
    setIsValidValueInput(true)
    return
  }

  const numericValue = parseFloat(inputValue)

  // Check if the input value is a valid number
  if (isNaN(numericValue) || numericValue.toString() !== inputValue.trim()) {
    setIsValidValueInput(false)
  } else {
    setIsValidValueInput(true)
  }

  //check if sufficient balance
  if (!selectedToken?.balance || formattedTokenQty < selectedToken?.balance) {
    setIsSufficientBalance(false)
  } else {
    setIsSufficientBalance(true)
  }

  // format value for transaction
  if (!isNaN(numericValue) && !isNaN(decimals)) {
    const factor = Math.pow(10, decimals)
    const formattedValue = BigInt(Math.round(numericValue * factor))

    setTokenQtyInputValue(inputValue)
    setFormattedTokenQty(formattedValue)
  }
}
