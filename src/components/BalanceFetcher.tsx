import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { type Address, useAccount, useBalance, useContractReads } from 'wagmi'
import {
  ErcBalanceConfig,
  ETHBalanceConfig,
  TokenContractConfig,
  TokenData,
  TokenDataArray
} from '../types/tokenListTypes'
import { useDappContext } from '../contexts/dAppContext'
import { useTransactionToast } from '../hooks/useToast'
import { ercBalanceData, ethBalanceData } from '../types/ethCallTypes'

export const BalanceFetcher = () => {
  const { address, isConnected } = useAccount()
  const {
    retrievedWalletBalances,
    setRetrievedWalletBalances,
    listTokens,
    setListTokens,
    tokenContractConfigs
  } = useDappContext()
  const [readyToFetchEth, setReadyToFetchEth] = useState<boolean>(false)
  const [readyToFetchErc, setReadyToFetchErc] = useState<boolean>(false)
  const [readyToFetch, setReadyToFetch] = useState<boolean>(false)
  const [readyToProcess, setReadyToProcess] = useState<boolean>(false)
  const [erc20ContractConfigs, setErc20ContractConfigs] = useState<
    ErcBalanceConfig[]
  >([])
  const [ethBalanceConfig, setEthBalanceConfig] = useState<ETHBalanceConfig>()

  useEffect(() => {
    console.log('balance fetcher mounted')
  }, [])

  useEffect(() => {
    console.log(
      '@BalanceFetcher - erc20 contract configs: ',
      erc20ContractConfigs
    )
  }, [erc20ContractConfigs])

  useEffect(() => {
    console.log('@BalanceFetcher - eth balance config: ', ethBalanceConfig)
  }, [ethBalanceConfig])

  useEffect(() => {
    // Prepare balance query configs
    const newErc20ContractConfigs = createContractConfigs(
      address,
      tokenContractConfigs
    )
    const newEthBalanceConfig = createETHBalanceConfig(address)

    setErc20ContractConfigs(newErc20ContractConfigs)
    setEthBalanceConfig(newEthBalanceConfig)
  }, [isConnected, address, tokenContractConfigs])

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
      setReadyToFetchEth(true)
    },
    // onError(error) {
    //   console.log('Error', error)
    // },
    watch: false,
    enabled: true
  })

  // Fetch ERC20 token balances
  const {
    data: ercBalanceData,
    isError: ercBalanceIsError,
    isRefetching: ercIsRefetching,
    refetch: refetchErcBalances
  } = useContractReads({
    contracts: erc20ContractConfigs,
    select: (data) =>
      data.map((item, index) => ({
        ...item,
        address: erc20ContractConfigs[index].address
      })),
    onSuccess(ercBalanceData) {
      console.log('@BalanceFetcher - fetched ERC20 Balances ', ercBalanceData)
      setReadyToFetchErc(true)
    },
    onError(error) {
      console.log('Error fetching ERC20 balances', error)
    },
    watch: false,
    enabled: true
  })

  useEffect(() => {
    console.log(
      '@ BalanceFetcher - readyToFetchEth: ',
      readyToFetchEth,
      'readyToFetchErc: ',
      readyToFetchErc
    )
    if (readyToFetchEth && readyToFetchErc) {
      console.log('@ BalanceFetcher - ready to fetch')
      setReadyToFetch(true)
    }
  }, [readyToFetchEth, readyToFetchErc])

  useEffect(() => {
    if (readyToFetch) {
      console.log('@ BalanceFetcher - refecting balances...')
      refetchErcBalances()
      refetchEthBalance()
      setReadyToFetch(false)
      setReadyToProcess(true)
    } else {
      console.log('@ BalanceFetcher - not ready to fetch')
    }
  }, [readyToFetch, readyToFetchErc, readyToFetchEth])

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
      console.log('!!!updating listTokens ', updatedTokens)
      setListTokens(updatedTokens)
      setReadyToProcess(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ercBalanceData, ethBalanceData, readyToProcess])

  return null
}

function createContractConfigs(
  address: Address | undefined,
  configs: TokenContractConfig[]
): ErcBalanceConfig[] {
  if (!address) {
    throw new Error('Address is undefined')
  }
  // console.log('creating ERC Contract Configs', address, configs)
  return configs.map((config) => ({
    ...config,
    functionName: 'balanceOf',
    args: [address]
  })) as ErcBalanceConfig[]
}

function createETHBalanceConfig(
  address: Address | undefined
): ETHBalanceConfig {
  if (!address) {
    throw new Error('Address is undefined')
  }
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
    ercBalanceData.length > 0 &&
    ethBalanceData &&
    listTokens
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
    console.log('!!!completed balance processing', updatedTokens)
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

export default React.memo(BalanceFetcher)
