import React, { useEffect } from 'react'
import { Flex } from '@radix-ui/themes'
import { useAccount } from 'wagmi'

import { useSendWidgetContext } from '../../contexts/sendWidgetContext'
import { useDappContext } from '../../contexts/dAppContext'
import { TokenData, TokenDataArray } from '../../types/tokenListTypes'
import { TokenInputBox } from './TokenInputBox'
import { AddressInputBox } from './AddressInputBox'
import { SendButton } from './SendButton'

export function SendWidget() {
  const { isConnected } = useAccount()
  const {
    setAddressInputValue,
    setTokenQtyInputValue,
    setFormattedTokenQty,
    setSelectedToken,
    selectedToken
  } = useSendWidgetContext()
  const { listTokens, retrievedWalletBalances } = useDappContext()

  useEffect(() => {
    if (!isConnected) {
      flushInputs(
        isConnected,
        setAddressInputValue,
        setTokenQtyInputValue,
        setFormattedTokenQty,
        setSelectedToken,
        listTokens
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  /**
   * update selectedToken balance if it has changed
   */
  useEffect(() => {
    if (selectedToken) {
      // Find the token in listTokens that matches selectedToken
      const updatedToken = listTokens.find(
        (token) => token && token.ID === selectedToken.ID
      )

      if (updatedToken && updatedToken.balance !== selectedToken.balance) {
        // Update selectedToken only if the balance is different
        setSelectedToken((prevSelectedToken) => ({
          ...prevSelectedToken,
          balance: updatedToken.balance
        }))
      }
    }
  }, [retrievedWalletBalances, listTokens, selectedToken, setSelectedToken])

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

const flushInputs = (
  isConnected: boolean,
  setAddressInputValue: React.Dispatch<React.SetStateAction<string>>,
  setTokenQtyInputValue: React.Dispatch<React.SetStateAction<string>>,
  setFormattedTokenQty: React.Dispatch<React.SetStateAction<bigint>>,
  setSelectedToken: React.Dispatch<React.SetStateAction<TokenData>>,
  listTokens: TokenDataArray
) => {
  if (!isConnected && listTokens) {
    setAddressInputValue('')
    setTokenQtyInputValue('')
    setFormattedTokenQty(0n)
    setSelectedToken(listTokens[0] as TokenData)
  }
}
