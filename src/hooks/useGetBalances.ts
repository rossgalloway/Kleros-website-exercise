import { type Address, useAccount, useBalance, useContractReads } from 'wagmi'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  TokenContractConfig,
  TokenData,
  TokenDataArray
} from '../types/tokenListTypes'
import { useDappContext } from '../contexts/dAppContext'

import { ercBalanceData, ethBalanceData } from '../types/ethCallTypes'
import { useTransactionToast } from './useToast'

export function useGetBalances() {
  const { address } = useAccount()
  const {
    tokenContractConfigs,
    retrievedWalletBalances,
    setRetrievedWalletBalances,
    listTokens,
    setListTokens
  } = useDappContext()
  const [erc20ContractConfigs, setErc20ContractConfigs] = useState<
    TokenContractConfig[]
  >([])
  const [ethBalanceConfig, setEthBalanceConfig] = useState({})

  useEffect(() => {
    // Prepare balance query configs
    const newErc20ContractConfigs = createContractConfigs(
      address,
      tokenContractConfigs
    )
    const newEthBalanceConfig = createETHBalanceConfig(address)

    setErc20ContractConfigs(newErc20ContractConfigs)
    setEthBalanceConfig(newEthBalanceConfig)
  }, [address, tokenContractConfigs])

  // Fetch ETH balance
  const {
    data: ethBalanceData,
    isError: ethBalanceIsError,
    isRefetching: ethIsRefetching,
    refetch: refetchEthBalance
  } = useBalance({
    ...ethBalanceConfig,
    onSuccess() {
      console.log('@useGetBalances - fetched ETH Balance ', ethBalanceData)
    },
    onError(error) {
      console.log('Error', error)
    },
    watch: true,
    enabled: false
  })

  // Fetch ERC20 token balances
  // this is still successful if the wallet is not connected
  const {
    data: ercBalanceData,
    isError: ercBalanceIsError,
    isRefetching: ercIsRefetching,
    refetch: refetchErcBalances
  } = useContractReads({
    contracts: erc20ContractConfigs,
    select: (ercBalanceData) =>
      ercBalanceData.map((item, index) => ({
        ...item,
        address: erc20ContractConfigs[index].address
      })),
    onSuccess() {
      console.log('@useGetBalances - fetched ERC20 Balances ', ercBalanceData)
    },
    onError(error) {
      console.log('Error', error)
    },
    watch: true,
    enabled: false
  })

  useBalanceToasts(
    ethBalanceIsError,
    ercBalanceIsError,
    ethIsRefetching,
    ercIsRefetching,
    retrievedWalletBalances
  )

  useEffect(() => {
    const updatedTokens = processBalances(
      ercBalanceData,
      ethBalanceData,
      listTokens,
      setRetrievedWalletBalances
    )
    // console.log('processed Balances', updatedTokens)
    if (updatedTokens && updatedTokens.length > 0) {
      setListTokens(updatedTokens as TokenDataArray)
      setRetrievedWalletBalances(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ercBalanceData, ethBalanceData])

  return {
    refetchEthBalance,
    refetchErcBalances
  }
}

function createContractConfigs(
  address: Address | undefined,
  configs: TokenContractConfig[]
) {
  console.log('createContractConfigs', address, configs)
  if (!address) return []
  return configs.map((config) => ({
    ...config,
    functionName: 'balanceOf',
    args: [address]
  }))
}

function createETHBalanceConfig(address: Address | undefined) {
  console.log('createETHBalanceConfig', address)
  return {
    address,
    watch: true
  }
}

export function processBalances(
  ercBalanceData: ercBalanceData,
  ethBalanceData: ethBalanceData,
  listTokens: TokenDataArray,
  setRetrievedWalletBalances: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (
    ercBalanceData &&
    ethBalanceData &&
    listTokens
    //&& !retrievedWalletBalances
  ) {
    const updatedTokens = listTokens
      .filter((token): token is TokenData => token !== undefined)
      .map((token) => {
        const balanceData =
          token.addr === '0xNull'
            ? ethBalanceData.value
            : (ercBalanceData.find((b) => b.address === token?.addr)?.result as
                | bigint
                | undefined)

        return { ...token, balance: balanceData }
      })
    setRetrievedWalletBalances(true)
    console.log('complete balance processing', updatedTokens)
    return updatedTokens
  }
}

const useBalanceToasts = (
  ethBalanceIsError: boolean,
  ercBalanceIsError: boolean,
  ethIsRefetching: boolean,
  ercIsRefetching: boolean,
  retrievedWalletBalances: boolean
) => {
  const currentToastId = useRef('')
  const { showErrorToast, showInfoToast, showBalanceSuccessToast } =
    useTransactionToast()

  useEffect(() => {
    // Dismiss the current toast when the state changes
    if (currentToastId.current) {
      toast.dismiss(currentToastId.current)
      currentToastId.current = ''
    }

    // Show loading toast if either balance check is loading
    if (ethIsRefetching || ercIsRefetching) {
      currentToastId.current = showInfoToast('Fetching balances...')
    }
    // Show error toast if any balance check encounters an error
    else if (ethBalanceIsError || ercBalanceIsError) {
      currentToastId.current = showErrorToast('Error fetching balances')
      // console.log('eth: ', ethBalanceIsError, 'erc: ', ercBalanceIsError)
    }
    // Show success toast when all balances are fetched successfully
    else if (retrievedWalletBalances) {
      currentToastId.current = showBalanceSuccessToast('Balances updated')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ethBalanceIsError,
    ercBalanceIsError,
    ethIsRefetching,
    ercIsRefetching,
    retrievedWalletBalances
  ])

  // Clean up the toast on unmount
  useEffect(() => {
    return () => {
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current)
      }
    }
  }, [])
}
