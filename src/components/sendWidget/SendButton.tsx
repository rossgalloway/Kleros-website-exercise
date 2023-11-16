/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@radix-ui/themes'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { uniqueId } from 'lodash'
import { useSendWidgetContext } from '../../contexts/sendWidgetContext'
import { useDappContext } from '../../contexts/dAppContext'
import { useTransactionToast } from '../../hooks/useToast'
import {
  ErcPayload,
  EthPayload,
  TransactionPayload,
  type TransactionResult
} from './transactionComponentTypes'
import TransactionComponent from './TransactionComponent'

export enum PayloadType {
  EthPayload,
  ErcPayload
}

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
  const [transactionPayload, setTransactionPayload] = useState<
    TransactionPayload | undefined
  >()

  useEffect(() => {
    console.log('transaction payload: ', transactionPayload)
  }, [transactionPayload])

  useEffect(() => {
    if (!selectedToken) return
    if (selectedToken.ticker === 'ETH') {
      const newTransactionPayload: EthPayload = {
        type: PayloadType.EthPayload,
        to: validAddress,
        value: formattedTokenQty
      }
      setTransactionPayload(newTransactionPayload)
    } else {
      const newTransactionPayload: ErcPayload = {
        type: PayloadType.ErcPayload,
        token: selectedToken.addr,
        to: validAddress,
        value: formattedTokenQty
      }
      setTransactionPayload(newTransactionPayload)
    }
  }, [selectedToken, formattedTokenQty, validAddress])

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

  return (
    <>
      {transactionPayload && <MultiSendButton payload={transactionPayload} />}
    </>
  )
}

type MultiSendButtonProps = {
  payload: TransactionPayload
}

const MultiSendButton = ({ payload }: MultiSendButtonProps) => {
  const {
    setRetrievedWalletBalances,
    setActiveTransactions,
    activeTransactions,
    completedTransactions,
    setCompletedTransactions
  } = useDappContext()
  const { showTransactionSuccessToast, showErrorToast } = useTransactionToast()

  /**
   * adds a transaction to the activeTransactions array in order to load the transaction component
   * @param transactionDetails is the payload to be passed to a wagmi hook
   */
  const handleTransactionInitiation = (
    transactionDetails: TransactionPayload
  ) => {
    const transactionId = uniqueId('transaction-')
    setActiveTransactions((prev) => [
      ...prev,
      { id: transactionId, details: transactionDetails }
    ])
  }

  const onTransactionComplete = useCallback((result: TransactionResult) => {
    if (result.status === 'success') {
      console.log('Transaction Receipt', result.receipt)
      showTransactionSuccessToast('Transfer successful!', result.id)
    } else {
      console.error('Transaction failed:', result.error)
      showErrorToast('Transaction failed - see console for info', result.id)
    }
    setCompletedTransactions((prev) => [...prev, result])
    setActiveTransactions((prev) => prev.filter((tx) => tx.hash !== result.id))
    setRetrievedWalletBalances(false)
  }, [])

  return (
    <>
      {activeTransactions.map((transaction) => (
        <TransactionComponent
          key={transaction.id}
          id={transaction.id}
          type={transaction.details.type}
          transactionDetails={transaction.details}
          onTransactionComplete={onTransactionComplete}
          activeTransactions={activeTransactions}
        />
      ))}
      <Button
        className="button-main"
        color="blue"
        size="4"
        onClick={() =>
          // the transactionDetails object could be variable depending on the input type
          handleTransactionInitiation(payload)
        }
      >
        Send
      </Button>
    </>
  )
}
