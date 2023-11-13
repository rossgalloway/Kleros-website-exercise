/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Button } from '@radix-ui/themes'
import { type Address, useAccount } from 'wagmi'
import {
  useConnectModal,
  useAddRecentTransaction
} from '@rainbow-me/rainbowkit'
import { TokenData } from '../../types/tokenListTypes'
import { useSendWidgetContext } from '../../contexts/sendWidgetContext'
import { useErc20Send, useEthSend } from '../../hooks/wagmiSendHooks'

export function SendButton() {
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const {
    selectedToken,
    formattedTokenQty,
    validAddress,
    isSufficientBalance,
    isValidAddress,
    isValidValueInput
  } = useSendWidgetContext()

  if (!isConnected) {
    return (
      <Button className="button-main" size="4" onClick={openConnectModal}>
        Connect Wallet
      </Button>
    )
  }

  if (!isValidAddress) {
    return (
      <Button className="button-main" size="4" disabled>
        Enter Valid Address or ENS
      </Button>
    )
  }

  if (!isValidValueInput) {
    return (
      <Button className="button-main" size="4" disabled>
        Enter Valid Amount
      </Button>
    )
  }

  if (!isSufficientBalance) {
    return (
      <Button className="button-main" size="4" disabled>
        Insufficient Balance
      </Button>
    )
  }

  const isEthereumToken = selectedToken.ticker === 'ETH'

  return isEthereumToken ? (
    <EthSendButton
      validAddress={validAddress}
      formattedTokenQty={formattedTokenQty}
    />
  ) : (
    <Erc20SendButton
      selectedToken={selectedToken}
      validAddress={validAddress}
      formattedTokenQty={formattedTokenQty}
    />
  )
}

type Erc20SendButtonProps = {
  selectedToken: TokenData
  validAddress: Address
  formattedTokenQty: bigint
}

const Erc20SendButton = ({
  selectedToken,
  validAddress,
  formattedTokenQty
}: Erc20SendButtonProps) => {
  const addRecentTransaction = useAddRecentTransaction()
  const { writeErc20Transfer, transactionHash: ercTransactionHash } =
    useErc20Send(selectedToken, validAddress, formattedTokenQty)

  const handleERC20SendClick = async () => {
    try {
      await writeErc20Transfer?.()

      if (ercTransactionHash?.hash) {
        addRecentTransaction({
          hash: String(ercTransactionHash.hash),
          description: 'Send ERC-20 transaction'
        })
      }
    } catch (error) {
      console.error('Error sending ERC-20 transaction:', error)
    }
  }
  return (
    <Button
      className="button-main"
      color="blue"
      size="4"
      onClick={handleERC20SendClick}
    >
      Send
    </Button>
  )
}

type EthSendButtonProps = {
  validAddress: Address
  formattedTokenQty: bigint
}

const EthSendButton = ({
  validAddress,
  formattedTokenQty
}: EthSendButtonProps) => {
  const { sendTransaction, transactionHash: ethTransactionHash } = useEthSend()
  const addRecentTransaction = useAddRecentTransaction()

  const handleETHSendClick = async () => {
    try {
      await sendTransaction({
        to: validAddress,
        value: formattedTokenQty
      })

      if (ethTransactionHash?.hash) {
        addRecentTransaction({
          hash: String(ethTransactionHash.hash),
          description: 'Send ETH transaction'
        })
      }
    } catch (error) {
      console.error('Error sending ETH transaction:', error)
    }
  }

  return (
    <Button
      className="button-main"
      color="blue"
      size="4"
      onClick={handleETHSendClick}
    >
      Send
    </Button>
  )
}
