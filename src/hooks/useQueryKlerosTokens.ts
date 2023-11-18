import { useEffect, useRef } from 'react'
import { type Address, useContractRead, erc20ABI } from 'wagmi'

import { toast } from 'react-hot-toast'
import { useDappContext } from '../contexts/dAppContext'
import {
  TokenContractConfig,
  TokenData,
  TokenDataArray
} from '../types/tokenListTypes'
import { ETHData } from '../constants/tokenConstants'
import {
  badgeTcrContractConfig,
  tokensViewContractConfig
} from '../constants/klerosAbis'
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

//TODO: remove toast error fetching tokens when disconnecting

export const useQueryKlerosTokens = () => {
  const {
    setListTokens,
    setTokenContractConfigs,
    retrievedBadgeTokens,
    setRetrievedBadgeTokens
  } = useDappContext()

  const { badgeData, badgeIsError, badgeIsLoading, refetchBadgeData } =
    useQueryBadgeData()
  const { tokenIdsData, tokenIdsIsError, tokenIdsIsLoading } =
    useQueryTokenIds(badgeData)
  const { tokensData, tokensDataIsError, tokensDataIsLoading } =
    useGetTokensData(tokenIdsData)

  useEffect(() => {
    ProcessTokensData(
      tokensData,
      setListTokens,
      setRetrievedBadgeTokens,
      setTokenContractConfigs
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensData])

  useQueryKlerosToasts(
    badgeIsError,
    badgeIsLoading,
    tokenIdsIsError,
    tokenIdsIsLoading,
    tokensDataIsError,
    tokensDataIsLoading,
    retrievedBadgeTokens
  )

  return { tokensData, refetchBadgeData }
}
/**
 *
 * @returns
 */
function useQueryBadgeData() {
  const {
    data: badgeData,
    isError: badgeIsError,
    isLoading: badgeIsLoading,
    refetch: refetchBadgeData
  } = useContractRead({
    ...badgeTcrContractConfig,
    functionName: 'queryAddresses',
    enabled: false,
    args: [zeroAddress, BigInt(1000), filter, true],
    select: (data) => data?.[0]?.filter((address) => address !== zeroAddress)
  })

  return {
    badgeData,
    badgeIsError,
    badgeIsLoading,
    refetchBadgeData
  }
}

/**
 *
 * @param badgeData
 * @returns `tokenIdsData` is an array of tokenIds to input into the tokensView contract
 */
const useQueryTokenIds = (badgeData: Address[] | undefined) => {
  const {
    data: tokenIdsData,
    isError: tokenIdsIsError,
    isLoading: tokenIdsIsLoading,
    refetch: refetchTokenIdsData
  } = useContractRead({
    ...tokensViewContractConfig,
    functionName: 'getTokensIDsForAddresses',
    args: [t2crAddr, badgeData as Address[]],
    enabled: false,
    select: (tokenIdsData) => [...tokenIdsData] //spread operator to convert to array
  })

  useEffect(() => {
    if (badgeData) {
      refetchTokenIdsData()
    }
  }, [badgeData, refetchTokenIdsData])

  return { tokenIdsData, tokenIdsIsLoading, tokenIdsIsError }
}

/**
 *
 * @param tokenIdsData
 * @returns `tokensData` is an array of TokenData objects
 */
const useGetTokensData = (tokenIdsData: Address[] | undefined) => {
  const {
    data: tokensData,
    isError: tokensDataIsError,
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

  useEffect(() => {
    if (tokenIdsData) {
      refetchTokensData()
    }
  }, [tokenIdsData, refetchTokensData])

  return { tokensData, tokensDataIsLoading, tokensDataIsError }
}

export const ProcessTokensData = (
  tokensData: TokenData[] | undefined,
  setListTokens: React.Dispatch<React.SetStateAction<TokenDataArray>>,
  setRetrievedBadgeTokens: React.Dispatch<React.SetStateAction<boolean>>,
  setTokenContractConfigs: React.Dispatch<
    React.SetStateAction<TokenContractConfig[]>
  >
  // eslint-disable-next-line no-unused-vars
) => {
  if (!tokensData) return
  const contractConfigs = tokensData.map((token) => ({
    address: token.addr,
    abi: erc20ABI
  }))
  if (contractConfigs.length === 0) return
  setTokenContractConfigs(contractConfigs as TokenContractConfig[])
  const updatedListTokens = [ETHData, ...tokensData]
  setListTokens(updatedListTokens)
  setRetrievedBadgeTokens(true)
}

const useQueryKlerosToasts = (
  badgeIsError: boolean,
  badgeIsLoading: boolean,
  tokenIdsIsError: boolean,
  tokenIdsIsLoading: boolean,
  tokensDataError: boolean,
  tokensDataIsLoading: boolean,
  retrievedBadgeTokens: boolean
) => {
  const currentToastId = useRef('')
  const { showErrorToast, showLoadingToast, showBadgeSuccessToast } =
    useTransactionToast()

  useEffect(() => {
    // Dismiss the current toast when the state changes
    if (currentToastId.current) {
      toast.dismiss(currentToastId.current)
      currentToastId.current = ''
    }

    // Show loading toast if any query is loading
    if (badgeIsLoading || tokenIdsIsLoading || tokensDataIsLoading) {
      currentToastId.current = showLoadingToast('Fetching Kleros token list...')
    }
    // Show error toast if any query encounters an error
    else if (badgeIsError || tokenIdsIsError || tokensDataError) {
      currentToastId.current = showErrorToast(
        'Error fetching Kleros token list'
      )
    }
    // Show success toast when all data is fetched successfully
    else if (retrievedBadgeTokens) {
      currentToastId.current = showBadgeSuccessToast('Retrieved badge tokens')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    badgeIsError,
    badgeIsLoading,
    tokenIdsIsError,
    tokenIdsIsLoading,
    tokensDataError,
    tokensDataIsLoading,
    retrievedBadgeTokens
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
