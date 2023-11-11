import { useEffect } from 'react'
import { type Address, useContractRead, erc20ABI } from 'wagmi'

import { useTokens } from '../contexts/tokenContext'
import {
  TokenContractConfig,
  TokenData,
  TokenDataArray
} from '../types/tokenListTypes'
import { ETHData } from '../components/constants/tokenConstants'
import {
  badgeContractConfig,
  tokensViewContractConfig
} from '../components/constants/klerosAbis'
import { useTransactionToast } from './useToast'

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

export const useQueryKlerosTokens = () => {
  const { showBadgeSuccessToast } = useTransactionToast()
  const { setListTokens, setTokenContractConfigs, setRetrievedBadgeTokens } =
    useTokens()

  const { badgeData, refetchBadgeData } = useQueryBadgeData()
  const { tokenIdsData } = useQueryTokenIds(badgeData)
  const { tokensData } = useGetTokensData(tokenIdsData)

  useEffect(() => {
    ProcessTokensData(
      tokensData,
      setListTokens,
      setRetrievedBadgeTokens,
      setTokenContractConfigs,
      showBadgeSuccessToast
    )
  }, [tokensData])

  return { tokensData, refetchBadgeData }
}
/**
 *
 * @returns
 */
function useQueryBadgeData() {
  const {
    data: badgeData,
    isError: badgeError,
    isLoading: badgeIsLoading,
    refetch: refetchBadgeData
  } = useContractRead({
    ...badgeContractConfig,
    functionName: 'queryAddresses',
    enabled: false,
    args: [zeroAddress, BigInt(1000), filter, true],
    select: (data) => data?.[0]?.filter((address) => address !== zeroAddress)
  })

  useQueryKlerosToasts(badgeError, badgeIsLoading)

  return { badgeData, refetchBadgeData }
}

/**
 *
 * @param badgeData
 * @returns `tokenIdsData` is an array of tokenIds to input into the tokensView contract
 */
const useQueryTokenIds = (badgeData: Address[] | undefined) => {
  const {
    data: tokenIdsData,
    isError: tokenIdsError,
    isLoading: tokenIdsIsLoading,
    refetch: refetchTokenIdsData
  } = useContractRead({
    ...tokensViewContractConfig,
    functionName: 'getTokensIDsForAddresses',
    args: [t2crAddr, badgeData as Address[]],
    enabled: false,
    select: (tokenIdsData) => [...tokenIdsData] //spread operator to convert to array
  })

  useQueryKlerosToasts(tokenIdsError, tokenIdsIsLoading)

  useEffect(() => {
    if (badgeData) {
      refetchTokenIdsData()
      console.log('refetching tokenIdsData')
    }
  }, [badgeData, refetchTokenIdsData])

  return { tokenIdsData }
}

/**
 *
 * @param tokenIdsData
 * @returns `tokensData` is an array of TokenData objects
 */
const useGetTokensData = (tokenIdsData: Address[] | undefined) => {
  const {
    data: tokensData,
    isError: tokensDataError,
    isLoading: tokensDataIsLoading,
    refetch: refetchTokensData
  } = useContractRead({
    ...tokensViewContractConfig,
    functionName: 'getTokens',
    args: [t2crAddr, tokenIdsData as Address[]],
    select: (tokensData) => {
      return tokensData
        ?.filter((token) => token.addr !== zeroAddress)
        .map((token) => ({
          ...token,
          balance: 0n
        }))
    },
    enabled: false
  })

  useQueryKlerosToasts(tokensDataError, tokensDataIsLoading)

  useEffect(() => {
    if (tokenIdsData) {
      refetchTokensData()
      console.log('refetching tokensData')
    }
  }, [tokenIdsData, refetchTokensData])

  return { tokensData }
}

export const ProcessTokensData = (
  tokensData: TokenData[] | undefined,
  setListTokens: React.Dispatch<React.SetStateAction<TokenDataArray>>,
  setRetrievedBadgeTokens: React.Dispatch<React.SetStateAction<boolean>>,
  setTokenContractConfigs: React.Dispatch<
    React.SetStateAction<TokenContractConfig[]>
  >,
  // eslint-disable-next-line no-unused-vars
  showBadgeSuccessToast: (message: string) => void
) => {
  if (!tokensData) return
  const contractConfigs = tokensData.map((token) => ({
    address: token.addr,
    abi: erc20ABI
  }))
  if (contractConfigs.length === 0) return
  console.log('processing Kleros Tokens')
  setTokenContractConfigs(contractConfigs as TokenContractConfig[])
  const updatedListTokens = [ETHData, ...tokensData]
  setListTokens(updatedListTokens)
  setRetrievedBadgeTokens(true)
  showBadgeSuccessToast('retrieved badge tokens')
}

const useQueryKlerosToasts = (isError: boolean, isLoading: boolean) => {
  const { setRetrievedBadgeTokens } = useTokens()
  const { showErrorToast, showInfoToast } = useTransactionToast()
  useEffect(() => {
    if (isError) {
      showErrorToast('Error fetching Kleros token list')
      setRetrievedBadgeTokens(false)
    }
  }, [isError, setRetrievedBadgeTokens, showErrorToast])

  useEffect(() => {
    if (isLoading) {
      showInfoToast('Fetching Kleros token list...')
    }
  }, [isLoading, showInfoToast])
}
