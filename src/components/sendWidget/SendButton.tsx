/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Button } from '@radix-ui/themes'
import {
  erc20ABI,
  useAccount,
  useContractWrite,
  useSendTransaction,
  useWaitForTransaction
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSendWidgetContext } from './sendWidgetContext'
import { useTransactionToast } from '../../hooks/useToast'
import { stringify } from 'viem'

export function SendButton() {
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const {
    selectedToken,
    formattedTokenQty,
    validAddress,
    isSufficientBalance,
    isValidAddress
  } = useSendWidgetContext()
  const { showSuccessToast, showErrorToast, showLoadingToast, showInfoToast } =
    useTransactionToast()

  const handleERC20SendClick = () => {
    writeErc20Transfer({
      args: [validAddress, formattedTokenQty]
    })
  }

  const handleETHSendClick = () => {
    sendTransaction({
      to: validAddress,
      value: formattedTokenQty
      //  value: parseEther(value)
    })
  }

  let erc20ContractConfig = {}
  if (selectedToken) {
    erc20ContractConfig = {
      address: selectedToken.addr,
      abi: erc20ABI
    } as const
  }

  const {
    write: writeErc20Transfer,
    data: dataErc20Transfer,
    error: ercError,
    isLoading: ercIsLoading,
    isError: ercIsError
  } = useContractWrite({
    ...erc20ContractConfig,
    functionName: 'transfer',
    args: [validAddress, formattedTokenQty]
  })
  const {
    data: ercReceipt,
    isLoading: ercIsPending,
    isSuccess: ercIsSuccess
  } = useWaitForTransaction({ hash: dataErc20Transfer?.hash })

  const { data, error, isLoading, isError, sendTransaction } =
    useSendTransaction()
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess
  } = useWaitForTransaction({ hash: data?.hash })

  useEffect(() => {
    if (ercIsSuccess || isSuccess) {
      showSuccessToast('Transfer successful!')
      if (ercIsSuccess) {
        showSuccessToast(stringify(ercReceipt, null, 2))
      } else if (isSuccess) {
        showSuccessToast(stringify(receipt, null, 2))
      }
    }
  }, [ercIsSuccess, isSuccess])

  useEffect(() => {
    if (ercIsLoading || isLoading) {
      showInfoToast('Check wallet to send transaction')
    }
  }, [ercIsLoading, isLoading])

  useEffect(() => {
    if (ercIsPending || isPending) {
      showLoadingToast('Transaction processing...')
    }
  }, [ercIsPending, isPending])

  useEffect(() => {
    if (ercIsError || isError) {
      showErrorToast('Transaction failed')
    }
  }, [ercIsError, isError, ercError, error])

  return (
    <>
      {isConnected ? (
        isValidAddress ? (
          isSufficientBalance ? (
            selectedToken.ticker !== 'ETH' ? (
              <Button
                className="button-main"
                color="green"
                size="4"
                onClick={handleERC20SendClick}
              >
                Send
              </Button>
            ) : (
              <Button
                className="button-main"
                color="blue"
                size="4"
                onClick={handleETHSendClick}
              >
                Send
              </Button>
            )
          ) : (
            <Button className="button-main" size="4" disabled>
              Insufficient Balance
            </Button>
          )
        ) : (
          <Button className="button-main" size="4" disabled>
            Enter Valid Address
          </Button>
        )
      ) : (
        <Button className="button-main" size="4" onClick={openConnectModal}>
          Connect Wallet
        </Button>
      )}
    </>
  )
}
