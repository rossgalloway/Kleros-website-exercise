/* eslint-disable react-hooks/exhaustive-deps */
import React, { useReducer, useState } from 'react'
import { Button } from '@radix-ui/themes'
import { type Address, useAccount } from 'wagmi'
import {
  useConnectModal,
  useAddRecentTransaction
} from '@rainbow-me/rainbowkit'
import { uniqueId } from 'lodash'
import { TransactionReceipt } from 'viem'
import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useErc20Send, useEthSend } from '../../hooks/wagmiSendHooks'
import { useTransactionToast } from '../../hooks/useToast'
import { useSendWidgetContext } from '../../contexts/sendWidgetContext'
import { TokenData } from '../../types/tokenListTypes'

type TransactionState = {
  id: string
  isSuccess: boolean
  isLoading: boolean
  isPending: boolean
  sendIsError: boolean
  transactionIsError: boolean
  receipt: TransactionReceipt | undefined
  transactionHash: { hash: string } | undefined
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

type EthSendButtonProps = {
  validAddress: Address
  formattedTokenQty: bigint
}

const EthSendButton = ({
  validAddress,
  formattedTokenQty
}: EthSendButtonProps) => {
  const sendTransaction = useEthSend()
  const addRecentTransaction = useAddRecentTransaction()
  const handleTransaction = useSendTransactionToasts()
  const [transactionState, setTransactionState] = useState<TransactionState>()

  const handleETHSendClick = () => {
    const newTransactionState = sendTransaction({
      to: validAddress,
      value: formattedTokenQty
    })

    setTransactionState(newTransactionState)

    handleTransaction(
      newTransactionState.id,
      newTransactionState.isSuccess,
      newTransactionState.isLoading,
      newTransactionState.isPending,
      newTransactionState.sendIsError,
      newTransactionState.transactionIsError,
      newTransactionState.receipt,
      newTransactionState.transactionHash
    )
  }

  useEffect(() => {
    if (transactionState?.transactionHash?.hash) {
      addRecentTransaction({
        hash: String(transactionState.transactionHash.hash),
        description: 'Send ETH transaction'
      })
    }
  }, [transactionState, addRecentTransaction])

  return (
    <Button
      className="button-main"
      color="blue"
      size="4"
      onClick={handleETHSendClick}
    >
      Send {transactionState ? transactionState.id : ''}
    </Button>
  )
}

type TransactionAction =
  | { type: 'ADD'; transaction: TransactionState }
  | { type: 'UPDATE'; index: number; transaction: Partial<TransactionState> }

function transactionReducer(
  state: TransactionState[],
  action: TransactionAction
): TransactionState[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.transaction]
    case 'UPDATE':
      return state.map((transaction, index) =>
        index === action.index
          ? { ...transaction, ...action.transaction }
          : transaction
      )
    default:
      throw new Error()
  }
}

const useSendTransactionToasts = () => {
  const { showSuccessToast, showErrorToast, showLoadingToast } =
    useTransactionToast()
  const [transactions, dispatch] = useReducer(transactionReducer, [])
  const [toastIds, setToastIds] = useState({}) // New state variable for toastIds

  const handleTransaction = (
    id: string,
    isSuccess: boolean,
    isLoading: boolean,
    isPending: boolean,
    sendIsError: boolean,
    transactionIsError: boolean,
    receipt: TransactionReceipt | undefined,
    transactionHash: { hash: string } | undefined
  ) => {
    const existingTransactionIndex = transactions.findIndex(
      (transaction) => transaction.id === id
    )

    if (existingTransactionIndex !== -1) {
      // Update the existing transaction
      dispatch({
        type: 'UPDATE',
        index: existingTransactionIndex,
        transaction: {
          id,
          isSuccess,
          isLoading,
          isPending,
          sendIsError,
          transactionIsError,
          receipt,
          transactionHash
        }
      })
    } else {
      // Add a new transaction
      dispatch({
        type: 'ADD',
        transaction: {
          id,
          isSuccess,
          isLoading,
          isPending,
          sendIsError,
          transactionIsError,
          receipt,
          transactionHash
        }
      })
    }
  }

  useEffect(() => {
    transactions.forEach((transaction) => {
      const {
        id,
        isSuccess,
        isLoading,
        isPending,
        sendIsError,
        transactionIsError,
        receipt
      } = transaction
      let toastId = id

      if (isLoading) {
        toastId = showLoadingToast('Check wallet to send transaction', id)
      } else if (isPending) {
        toastId = showLoadingToast('Transaction processing...', id)
      } else if (isSuccess) {
        toastId = showSuccessToast('Transfer successful!', id)
        console.log('Transaction Receipt', receipt)
      } else if (sendIsError || transactionIsError) {
        toastId = showErrorToast(
          'Transaction failed - see console for info',
          id
        )
      }

      // Update the transaction state with the toastId
      setToastIds((prevToastIds) => ({ ...prevToastIds, [id]: toastId }))
    })
  }, [transactions])
  console.log('transaction array: ', transactions)

  return handleTransaction
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

// type transactionData = {
//   id: string
//   isSuccess: boolean
//   isLoading: boolean
//   isPending: boolean
//   sendIsError: boolean
//   transactionIsError: boolean
//   receipt: TransactionReceipt | undefined
// } | null

// const useSendTransactionToasts = () => {
//   const { showSuccessToast, showErrorToast, showLoadingToast } =
//     useTransactionToast()
//   const [transactionData, setTransactionData] = useState<transactionData>(null)

//   const handleTransaction = (
//     id: string,
//     isSuccess: boolean,
//     isLoading: boolean,
//     isPending: boolean,
//     sendIsError: boolean,
//     transactionIsError: boolean,
//     receipt: TransactionReceipt | undefined
//   ) => {
//     setTransactionData({
//       id,
//       isSuccess,
//       isLoading,
//       isPending,
//       sendIsError,
//       transactionIsError,
//       receipt
//     })
//   }

//   useEffect(() => {
//     console.log('transactionData Set: ', transactionData)
//     if (transactionData) {
//       console.log('has data')
//       const {
//         id,
//         isSuccess,
//         isLoading,
//         isPending,
//         sendIsError,
//         transactionIsError,
//         receipt
//       } = transactionData
//       let toastId: string
//       console.log(
//         'id: ',
//         id,
//         'isSuccess: ',
//         isSuccess,
//         'isLoading: ',
//         isLoading,
//         'isPending: ',
//         isPending
//       )

//       if (isLoading) {
//         toastId = showLoadingToast('Check wallet to send transaction', id)
//         console.log(toastId)
//       } else if (isPending) {
//         toastId = showLoadingToast('Transaction processing...', id)
//         console.log(toastId)
//       } else if (isSuccess) {
//         toastId = showSuccessToast('Transfer successful!', id)
//         console.log(toastId)
//         console.log('Transaction Receipt', receipt)
//       } else if (sendIsError || transactionIsError) {
//         toastId = showErrorToast(
//           'Transaction failed - see console for info',
//           id
//         )
//         console.log(toastId)
//       }

//       // return () => {
//       //   if (toastId) {
//       //     toast.dismiss(toastId)
//       //   }
//       // }
//     }
//   }, [transactionData])

//   return handleTransaction
// }
