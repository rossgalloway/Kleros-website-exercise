import { useEffect } from 'react'
import { type Address, useContractRead } from 'wagmi'

import { useTransactionToast } from '../../hooks/useToast'
import { useTokens } from '../../contexts/tokenContext'
import { badgeContractConfig, tokensViewContractConfig } from './abis'

const zeroAddress = '0x0000000000000000000000000000000000000000'
const t2crAddr = '0xebcf3bca271b26ae4b162ba560e243055af0e679'

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

// Custom hook
export function useQueryBlockchain() {
  const { showErrorToast, showInfoToast } = useTransactionToast()
  const { shouldFetchTokens, setShouldFetchTokens } = useTokens()

  const {
    data: badgeData,
    isError: badgeError,
    isLoading: badgeIsLoading,
    refetch: refetchBadgeData
  } = useContractRead({
    ...badgeContractConfig,
    functionName: 'queryAddresses',
    args: [zeroAddress, BigInt(1000), filter, true],
    select: (data) => data?.[0]?.filter((address) => address !== zeroAddress),
    enabled: false
  })

  useEffect(() => {
    if (shouldFetchTokens) {
      refetchBadgeData()
      setShouldFetchTokens(false)
    }
  }, [shouldFetchTokens, refetchBadgeData])

  const {
    data: tokenIdsData,
    isError: tokenIdsError,
    isLoading: tokenIdsIsLoading,
    refetch: refetchTokenIdsData
  } = useContractRead({
    ...tokensViewContractConfig,
    functionName: 'getTokensIDsForAddresses',
    args: [t2crAddr, badgeData as Address[]],
    enabled: false
  })

  useEffect(() => {
    if (badgeData) {
      refetchTokenIdsData()
    }
  }, [badgeData, refetchTokenIdsData])

  const {
    data: tokensData,
    isError: tokensDataError,
    isLoading: tokensDataIsLoading,
    refetch: refetchTokensData
  } = useContractRead({
    ...tokensViewContractConfig,
    functionName: 'getTokens',
    args: [t2crAddr, tokenIdsData as Address[]],
    select: (data) => {
      return data
        ?.filter((token) => token.addr !== zeroAddress)
        .map((token) => ({
          ...token,
          balance: 0n
        }))
    },
    enabled: false
  })

  useEffect(() => {
    if (tokenIdsData) {
      refetchTokensData()
    }
  }, [tokenIdsData, refetchTokensData])

  useEffect(() => {
    if (badgeError || tokenIdsError || tokensDataError) {
      showErrorToast('Error fetching Kleros token list')
    }
  }, [badgeError, tokenIdsError, tokensDataError, showErrorToast])

  useEffect(() => {
    if (badgeIsLoading || tokenIdsIsLoading || tokensDataIsLoading) {
      showInfoToast('Fetching Kleros token list...')
    }
  }, [badgeIsLoading, tokenIdsIsLoading, tokensDataIsLoading, showInfoToast])

  return { badgeData, tokenIdsData, tokensData }
}
