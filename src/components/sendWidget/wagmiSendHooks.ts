import {
  useSendTransaction,
  useWaitForTransaction,
  useContractWrite,
  usePrepareContractWrite,
  erc20ABI
} from 'wagmi'
import { Address, TransactionReceipt, stringify } from 'viem'
import { useEffect } from 'react'
import { useTransactionToast } from '../../hooks/useToast'
import { TokenData } from '../../types/tokenListTypes'

export const useEthSend = () => {
  const {
    sendTransaction,
    data: transactionHash,
    error: initializeError,
    isLoading,
    isError: sendIsError
  } = useSendTransaction()

  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
    error: transactionError,
    isError: TransactionIsError
  } = useWaitForTransaction({ hash: transactionHash?.hash })

  useSendTransactionToasts(
    isSuccess,
    isLoading,
    isPending,
    sendIsError,
    TransactionIsError,
    receipt
  )

  return {
    sendTransaction,
    transactionHash,
    initializeError,
    isLoading,
    sendIsError,
    receipt,
    isPending,
    isSuccess,
    transactionError,
    TransactionIsError
  }
}

export const useErc20Send = (
  selectedToken: TokenData,
  validAddress: Address,
  formattedTokenQty: bigint
) => {
  const { config } = usePrepareContractWrite({
    address: selectedToken.addr,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [validAddress, formattedTokenQty]
  })

  const {
    write: writeErc20Transfer,
    data: transactionHash,
    error: initializeError,
    isLoading,
    isError: sendIsError
  } = useContractWrite(config)

  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
    error: transactionError,
    isError: TransactionIsError
  } = useWaitForTransaction({ hash: transactionHash?.hash })

  useSendTransactionToasts(
    isLoading,
    sendIsError,
    isPending,
    isSuccess,
    TransactionIsError,
    receipt
  )

  return {
    writeErc20Transfer,
    transactionHash,
    initializeError,
    isLoading,
    sendIsError,
    receipt,
    isPending,
    isSuccess,
    transactionError,
    TransactionIsError
  }
}

const useSendTransactionToasts = (
  isSuccess: boolean,
  isLoading: boolean,
  isPending: boolean,
  sendIsError: boolean,
  transactionIsError: boolean,
  receipt: TransactionReceipt | undefined
) => {
  const { showSuccessToast, showErrorToast, showLoadingToast, showInfoToast } =
    useTransactionToast()

  useEffect(() => {
    if (isSuccess) {
      showSuccessToast('Transfer successful!')
      // TODO: add a button to the toast to view on block explorer instead of this toast
      showSuccessToast(stringify(receipt, null, 2))
    }
  }, [isSuccess, receipt, showSuccessToast])

  useEffect(() => {
    if (isLoading) {
      showInfoToast('Check wallet to send transaction')
    }
  }, [isLoading, showInfoToast])

  //TODO: this needs to be a promise so it goes away when the transaction is done
  useEffect(() => {
    if (isPending) {
      showLoadingToast('Transaction processing...')
    }
  }, [isPending, showLoadingToast])

  useEffect(() => {
    if (sendIsError || transactionIsError) {
      showErrorToast('Transaction failed - see console for info')
    }
  }, [sendIsError, transactionIsError, showErrorToast])
}
