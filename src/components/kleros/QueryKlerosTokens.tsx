import { useEffect } from 'react'
import { erc20ABI } from 'wagmi'
import { useTokens } from '../../contexts/tokenContext'
import { ETHData } from '../constants/tokenConstants'
import { useTransactionToast } from '../../hooks/useToast'
import { type TokenContractConfig } from '../../types/tokenListTypes'
import { useQueryBlockchain } from './useQueryBlockchain'

export function QueryKlerosTokens() {
  const { showBadgeSuccessToast } = useTransactionToast()
  const { setListTokens, setTokenContractConfigs, setRetrievedBadgeTokens } =
    useTokens()
  const { setShouldFetchTokens } = useTokens()
  const { tokensData } = useQueryBlockchain()

  useEffect(() => {
    if (tokensData) {
      const contractConfigs = tokensData.map((token) => ({
        address: token.addr,
        abi: erc20ABI
      }))
      setTokenContractConfigs(contractConfigs as TokenContractConfig[])
      // console.log('Token Contract Configs: ', contractConfigs)
      const updatedListTokens = [ETHData, ...tokensData]
      setListTokens(updatedListTokens)
      if (contractConfigs.length > 0) {
        setRetrievedBadgeTokens(true)
        showBadgeSuccessToast('retrieved badge tokens')
      }
      // console.log('Listed Tokens: ', updatedListTokens)
    } else {
      setShouldFetchTokens(true)
    }
  }, [
    setListTokens,
    setRetrievedBadgeTokens,
    setShouldFetchTokens,
    setTokenContractConfigs,
    showBadgeSuccessToast,
    tokensData
  ])

  return null
}
