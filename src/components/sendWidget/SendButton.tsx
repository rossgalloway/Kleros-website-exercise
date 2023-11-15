/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react'
import { Button } from '@radix-ui/themes'
import { type Address, useAccount } from 'wagmi'
import {
  useConnectModal,
  useAddRecentTransaction
} from '@rainbow-me/rainbowkit'
import { uniqueId } from 'lodash'
import { useErc20Send } from '../../hooks/wagmiSendHooks'
import { useSendWidgetContext } from '../../contexts/sendWidgetContext'
import { TokenData } from '../../types/tokenListTypes'
import { useDappContext } from '../../contexts/dAppContext'
import {
  type EthSendParams,
  type TransactionResult
} from './transactionComponentTypes'
import TransactionComponent from './TransactionComponent'
import { useTransactionToast } from '../../hooks/useToast'

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

  //TODO make into a single button that dispatches transactions by input type
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
  const {
    setRetrievedWalletBalances,
    setActiveTransactions,
    activeTransactions,
    completedTransactions,
    setCompletedTransactions
  } = useDappContext()
  const { showTransactionSuccessToast, showErrorToast } = useTransactionToast()
  const handleTransactionInitiation = (transactionDetails: EthSendParams) => {
    const transactionId = uniqueId('transaction-')
    setActiveTransactions((prev) => [
      ...prev,
      { id: transactionId, details: transactionDetails }
    ])
    console.log('active transactions: ', activeTransactions)
  }

  useEffect(() => {
    console.log('active transactions: ', activeTransactions)
  }, [activeTransactions])

  useEffect(() => {
    console.log('completed transactions: ', completedTransactions)
  }, [completedTransactions])

  // what happens after the transaction is complete
  // remove the transaction from the activeTransactions array
  // on success put in completed transaction array
  // update balances
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
          handleTransactionInitiation({
            to: validAddress,
            value: formattedTokenQty
          })
        }
      >
        Send {}
      </Button>
    </>
  )
}

// type TransactionAction =
//   | { type: 'ADD'; transaction: TransactionState }
//   | { type: 'UPDATE'; index: number; transaction: Partial<TransactionState> }

// function transactionReducer(
//   state: TransactionState[],
//   action: TransactionAction
// ): TransactionState[] {
//   switch (action.type) {
//     case 'ADD':
//       return [...state, action.transaction]
//     case 'UPDATE':
//       return state.map((transaction, index) =>
//         index === action.index
//           ? { ...transaction, ...action.transaction }
//           : transaction
//       )
//     default:
//       throw new Error()
//   }
// }

// const useSendTransactionToasts = () => {
//   const { showSuccessToast, showErrorToast, showLoadingToast } =
//     useTransactionToast()
//   const [transactions, dispatch] = useReducer(transactionReducer, [])
//   const [toastIds, setToastIds] = useState({}) // New state variable for toastIds

//   const handleTransaction = (
//     id: string,
//     isSuccess: boolean,
//     isLoading: boolean,
//     isPending: boolean,
//     sendIsError: boolean,
//     transactionIsError: boolean,
//     receipt: TransactionReceipt | undefined,
//     transactionHash: { hash: string } | undefined
//   ) => {
//     const existingTransactionIndex = transactions.findIndex(
//       (transaction) => transaction.id === id
//     )

//     if (existingTransactionIndex !== -1) {
//       // Update the existing transaction
//       dispatch({
//         type: 'UPDATE',
//         index: existingTransactionIndex,
//         transaction: {
//           id,
//           isSuccess,
//           isLoading,
//           isPending,
//           sendIsError,
//           transactionIsError,
//           receipt,
//           transactionHash
//         }
//       })
//     } else {
//       // Add a new transaction
//       dispatch({
//         type: 'ADD',
//         transaction: {
//           id,
//           isSuccess,
//           isLoading,
//           isPending,
//           sendIsError,
//           transactionIsError,
//           receipt,
//           transactionHash
//         }
//       })
//     }
//   }

//   useEffect(() => {
//     transactions.forEach((transaction) => {
//       const {
//         id,
//         isSuccess,
//         isLoading,
//         isPending,
//         sendIsError,
//         transactionIsError,
//         receipt
//       } = transaction
//       let toastId = id

//       if (isLoading) {
//         toastId = showLoadingToast('Check wallet to send transaction', id)
//       } else if (isPending) {
//         toastId = showLoadingToast('Transaction processing...', id)
//       } else if (isSuccess) {
//         toastId = showSuccessToast('Transfer successful!', id)
//         console.log('Transaction Receipt', receipt)
//       } else if (sendIsError || transactionIsError) {
//         toastId = showErrorToast(
//           'Transaction failed - see console for info',
//           id
//         )
//       }

//       // Update the transaction state with the toastId
//       setToastIds((prevToastIds) => ({ ...prevToastIds, [id]: toastId }))
//     })
//   }, [transactions])
//   console.log('transaction array: ', transactions)

//   return handleTransaction
// }

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
