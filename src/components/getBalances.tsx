import { useAccount, useBalance, useContractReads } from 'wagmi'
import { useTokens } from '../contexts/tokenContext'
import { useEffect } from 'react'
import { TokenData, TokenDataArray } from '../types/tokenListTypes'

export function GetBalances() {
  const { address } = useAccount()
  const { tokenContractConfigs } = useTokens()
  const { listTokens, setListTokens, setSelectedToken } = useTokens()

  const contracts = tokenContractConfigs.map((config) => ({
    ...config,
    functionName: 'balanceOf',
    args: [address as string]
  }))

  const { data: EthBalanceData, refetch: refetchBalance } = useBalance({
    address,
    watch: true
  })

  const {
    data: ercBalanceData,
    isError,
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

  useEffect(() => {
    if (ercBalanceData && EthBalanceData && listTokens) {
      const updatedListTokens: TokenDataArray = listTokens.map((token) => {
        if (token && token.addr === '0xNull') {
          return { ...token, balance: EthBalanceData.value } as TokenData
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
      setSelectedToken(updatedListTokens[0])
      console.log('updated Balance Values: ', updatedListTokens)
    }
  }, [ercBalanceData, EthBalanceData])

  return null
}

export default GetBalances
