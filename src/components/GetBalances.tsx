import { useEffect } from 'react'
import { type Address, useAccount, useBalance, useContractReads } from 'wagmi'
import { useTokens } from '../contexts/tokenContext'
import {
  TokenContractConfig,
  TokenData,
  TokenDataArray
} from '../types/tokenListTypes'
import { useTransactionToast } from '../hooks/useToast'
import { useSendWidgetContext } from './sendWidget/sendWidgetContext'

export function GetBalances() {
  const { address } = useAccount()
  const {
    tokenContractConfigs,
    setRetrievedWalletBalances,
    listTokens,
    setListTokens
  } = useTokens()
  const { showErrorToast, showInfoToast, showBalanceSuccessToast } =
    useTransactionToast()
  const { setSelectedToken } = useSendWidgetContext()

  // Prepare contract reads
  const contracts = createContractConfigs(address, tokenContractConfigs)

  // Fetch ETH balance
  const { data: ethBalanceData, isError: ethBalanceError } = useBalance({
    address,
    watch: true
  })

  // Fetch ERC20 token balances
  const {
    data: ercBalanceData,
    isError: ercBalanceError,
    isLoading
  } = useContractReads({
    contracts,
    select: (data) =>
      data.map((item, index) => ({
        ...item,
        address: contracts[index].address
      }))
  })

  useEffect(() => {
    if (ethBalanceError) showErrorToast('Error fetching ETH balance')
    if (ercBalanceError) showErrorToast('Error fetching ERC20 balance')
    if (isLoading) showInfoToast('Fetching balances...')
  }, [
    ethBalanceError,
    ercBalanceError,
    isLoading,
    showErrorToast,
    showInfoToast
  ])

  useEffect(() => {
    if (ercBalanceData && ethBalanceData && listTokens) {
      const updatedTokens = listTokens
        .filter((token): token is TokenData => token !== undefined)
        .map((token) => {
          const balanceData =
            token.addr === '0xNull'
              ? ethBalanceData.value
              : (ercBalanceData.find((b) => b.address === token?.addr)
                  ?.result as bigint | undefined)

          return { ...token, balance: balanceData }
        })

      if (updatedTokens.length > 0) {
        setListTokens(updatedTokens as TokenDataArray)
        setRetrievedWalletBalances(true)
        setSelectedToken(updatedTokens[0])
        showBalanceSuccessToast('Balances updated')
      }
    }
  }, [
    ercBalanceData,
    ethBalanceData,
    listTokens,
    setListTokens,
    setRetrievedWalletBalances,
    setSelectedToken,
    showBalanceSuccessToast
  ])

  return null
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

export default GetBalances
