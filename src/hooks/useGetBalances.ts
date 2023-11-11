import { type Address, useAccount, useBalance, useContractReads } from 'wagmi'
import { useEffect, useState } from 'react'
import {
  TokenContractConfig,
  TokenData,
  TokenDataArray
} from '../types/tokenListTypes'
import { useTokens } from '../contexts/tokenContext'
import { useSendWidgetContext } from '../components/sendWidget/sendWidgetContext'
import { ercBalanceData, ethBalanceData } from '../types/ethCallTypes'
import { useTransactionToast } from './useToast'

export function useGetBalances() {
  const { address } = useAccount()
  const {
    tokenContractConfigs,
    setRetrievedWalletBalances,
    listTokens,
    setListTokens
  } = useTokens()
  const { setSelectedToken } = useSendWidgetContext()
  const { showErrorToast, showInfoToast, showBalanceSuccessToast } =
    useTransactionToast()
  // const [fetchCounter, setFetchCounter] = useState(0)
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
    onSuccess(data) {
      console.log('Success', data)
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
    onSuccess(data) {
      console.log('Success', data)
    },
    onError(error) {
      console.log('Error', error)
    },
    watch: true,
    enabled: false
  })

  useEffect(() => {
    // if (ethBalanceIsError) showErrorToast('Error fetching ETH balance')
    // if (ercBalanceIsError) showErrorToast('Error fetching ERC20 balance')
    if (ethIsRefetching || ercIsRefetching)
      showInfoToast('Fetching balances...')
  }, [
    ethBalanceIsError,
    ercBalanceIsError,
    ethIsRefetching,
    ercIsRefetching,
    showErrorToast,
    showInfoToast
  ])

  useEffect(() => {
    processBalances(
      ercBalanceData,
      ethBalanceData,
      listTokens,
      setListTokens,
      setRetrievedWalletBalances,
      setSelectedToken,
      showBalanceSuccessToast
    )
  }, [ercBalanceData, ethBalanceData, address])

  return {
    refetchEthBalance,
    refetchErcBalances
  }
}

function createContractConfigs(
  address: Address | undefined,
  configs: TokenContractConfig[]
) {
  if (!address) return []
  return configs.map((config) => ({
    ...config,
    functionName: 'balanceOf',
    args: [address]
  }))
}

function createETHBalanceConfig(address: Address | undefined) {
  if (!address) return {}
  return {
    address,
    watch: true
  }
}

export function processBalances(
  ercBalanceData: ercBalanceData,
  ethBalanceData: ethBalanceData,
  listTokens: TokenDataArray,
  setListTokens: React.Dispatch<React.SetStateAction<TokenDataArray>>,
  setRetrievedWalletBalances: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedToken: React.Dispatch<React.SetStateAction<TokenData>>,
  showBalanceSuccessToast: (message: string) => void
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
    console.log('processed balances: ', updatedTokens)
    if (updatedTokens.length > 0) {
      setListTokens(updatedTokens as TokenDataArray)
      setRetrievedWalletBalances(true)
      setSelectedToken(updatedTokens[0])
      showBalanceSuccessToast('Balances updated')
    }
  }
}
