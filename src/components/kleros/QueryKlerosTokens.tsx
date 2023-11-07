import { useEffect, useState } from 'react'
import { Address, erc20ABI, useContractRead } from 'wagmi'
import { badgeContractConfig, tokensViewContractConfig } from './abis'
import { useTokens } from '../../contexts/tokenContext'
import { ETHData } from '../constants'
import { useTransactionToast } from '../../hooks/useToast'

export function QueryKlerosTokens() {
  const [badgeAddresses, setBadgeAddresses] = useState<Address[]>([])
  const [tokenIds, setTokenIds] = useState<readonly Address[]>([])
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const t2crAddr = '0xebcf3bca271b26ae4b162ba560e243055af0e679'
  const { showBadgeSuccessToast, showErrorToast, showInfoToast } =
    useTransactionToast()

  const filter = [
    false, // Do not include items which are not on the TCR.
    true, // Include registered items.
    false, // Do not include items with pending registration requests.
    true, // Include items with pending clearing requests.
    false, // Do not include items with challenged registration requests.
    true, // Include items with challenged clearing requests.
    false, // Include token if caller is the author of a pending request.
    false // Include token if caller is the challenger of a pending request.
  ] as const

  const {
    data: badgeData,
    isError: badgeError,
    isLoading: badgeIsLoading
  } = useContractRead({
    ...badgeContractConfig,
    functionName: 'queryAddresses',
    args: [zeroAddress, BigInt(1000), filter, true],
    select: (data) => data?.[0]?.filter((address) => address !== zeroAddress)
  })

  const {
    data: tokenIdsData,
    isError: tokenIdsError,
    isLoading: tokenIdsIsLoading
  } = useContractRead({
    ...tokensViewContractConfig,
    functionName: 'getTokensIDsForAddresses',
    args: [t2crAddr, badgeAddresses]
  })

  const {
    data: tokensData,
    isError: tokensDataError,
    isLoading: tokensDataIsLoading
  } = useContractRead({
    ...tokensViewContractConfig,
    functionName: 'getTokens',
    args: [t2crAddr, tokenIds],
    select: (data) => {
      return data
        ?.filter((token) => token.addr !== zeroAddress)
        .map((token) => ({
          ...token,
          balance: 0n
        }))
    }
  })

  if (badgeError || tokenIdsError || tokensDataError) {
    showErrorToast('Error fetching Kleros token list')
  }

  if (badgeIsLoading || tokenIdsIsLoading || tokensDataIsLoading) {
    showInfoToast('Fetching Kleros token list...')
  }

  const { setListTokens, setTokenContractConfigs, setRetrievedBadgeTokens } =
    useTokens()

  useEffect(() => {
    if (badgeData) {
      setBadgeAddresses(badgeData)
      // console.log('Addresses with badge: ', badgeData)
    }
  }, [badgeData])

  useEffect(() => {
    if (tokenIdsData) {
      setTokenIds(tokenIdsData)
      // console.log('Token IDs: ', tokenIdsData)
    }
  }, [tokenIdsData])

  useEffect(() => {
    if (tokensData) {
      const contractConfigs = tokensData.map((token) => ({
        address: token.addr,
        abi: erc20ABI
      }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setTokenContractConfigs(contractConfigs)
      // console.log('Token Contract Configs: ', contractConfigs)
      const updatedListTokens = [ETHData, ...tokensData]
      setListTokens(updatedListTokens)
      if (contractConfigs.length > 0) {
        setRetrievedBadgeTokens(true)
        showBadgeSuccessToast('retrieved badge tokens')
      }
      // console.log('Listed Tokens: ', updatedListTokens)
    }
  }, [tokensData])

  return null
}
