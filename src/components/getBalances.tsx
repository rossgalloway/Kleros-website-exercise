/* eslint-disable react-hooks/exhaustive-deps */
import { useAccount, useBalance, useContractReads } from 'wagmi'
import { useTokens } from '../contexts/tokenContext'
import { useEffect } from 'react'
import { TokenData, TokenDataArray } from '../types/tokenListTypes'
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
  const { showSuccessToast, showErrorToast, showInfoToast } =
    useTransactionToast()
  const { selectedToken, setSelectedToken } = useSendWidgetContext()

  const contracts = tokenContractConfigs.map((config) => ({
    ...config,
    functionName: 'balanceOf',
    args: [address as string]
  }))

  const { data: ethBalanceData, isError: ethBalanceError } = useBalance({
    address,
    watch: true
  })

  if (ethBalanceError) {
    showErrorToast('Error fetching ETH balance')
  }

  const {
    data: ercBalanceData,
    isError: ercBalanceError,
    isLoading
  } = useContractReads({
    contracts,
    select: (data) => {
      return data.map((item, index) => {
        return {
          ...item,
          address: contracts[index].address
        }
      })
    }
  })

  if (ercBalanceError) {
    showErrorToast('Error fetching ERC20 balance')
  }

  if (isLoading) {
    showInfoToast('Fetching balances...')
  }

  useEffect(() => {
    if (ercBalanceData && ethBalanceData && listTokens) {
      const updatedListTokens: TokenDataArray = listTokens.map((token) => {
        if (token && token.addr === '0xNull') {
          return { ...token, balance: ethBalanceData.value } as TokenData
        } else {
          // Find the corresponding balance data by matching the address
          const matchingBalanceData = ercBalanceData.find(
            (balanceData) => balanceData.address === token?.addr
          )
          return {
            ...token,
            balance: matchingBalanceData?.result
          } as TokenData
        }
      })
      setListTokens(updatedListTokens)
      if (updatedListTokens.length > 0) {
        showSuccessToast('Balances updated')
        console.log('updated Balance Values: ', updatedListTokens)
        setRetrievedWalletBalances(true)
        setSelectedToken(updatedListTokens[0])
      } else if (!selectedToken) {
        setSelectedToken(updatedListTokens[0])
      }
    }
  }, [ercBalanceData, ethBalanceData])

  return null
}

export default GetBalances
