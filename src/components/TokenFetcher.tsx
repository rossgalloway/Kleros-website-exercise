import React, { useEffect, useRef, useState } from 'react'
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
import { useTransactionToast } from '../hooks/useToast'

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

export const TokenFetcher = () => {
  const {
    setListTokens,
    setTokenContractConfigs,
    setRetrievedBadgeTokens,
    shouldFetchTokens,
    setShouldFetchBalances,
    setShouldFetchTokens
  } = useDappContext()
  const currentToastId = useRef('')
  const { showErrorToast, showLoadingToast, showBadgeSuccessToast } =
    useTransactionToast()
  const [goToStep2, setGoToStep2] = useState<boolean>(false)
  const [goToStep3, setGoToStep3] = useState<boolean>(false)
  const [readyToProcess, setReadyToProcess] = useState<boolean>(false)

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
    select: (data) => data?.[0]?.filter((address) => address !== zeroAddress),
    onSuccess: () => {
      setGoToStep2(true)
      console.log('goToStep2: ', goToStep2)
    }
  })

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
    onSuccess: () => {
      setGoToStep2(false)
      setGoToStep3(true)
      console.log('goToStep3: ', goToStep2)
    }
  })

  const {
    data: tokensData,
    isError: tokensDataIsError,
    isLoading: tokensDataIsLoading,
    isSuccess,
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
    enabled: false,
    onSuccess: () => {
      setGoToStep3(false)
      setReadyToProcess(true)
      console.log('readyToProcess: ', readyToProcess)
    }
  })

  useEffect(() => {
    if (shouldFetchTokens) {
      console.log('fetching badge Data')
      refetchBadgeData()
    }
  }, [refetchBadgeData, shouldFetchTokens])

  useEffect(() => {
    console.log('step2 - outside')
    if (badgeData) {
      console.log('step2 - inside')
      refetchTokenIdsData()
    }
  }, [goToStep2, refetchTokenIdsData])

  useEffect(() => {
    console.log('step3 - outside')
    if (tokenIdsData) {
      console.log('step3 - inside')
      refetchTokensData()
    }
  }, [goToStep3, refetchTokensData])

  useEffect(() => {
    console.log('processing data - outside')
    if (tokensData) {
      console.log('processing data - inside')
      ProcessTokensData(
        tokensData,
        setListTokens,
        setRetrievedBadgeTokens,
        setTokenContractConfigs,
        setShouldFetchBalances,
        setShouldFetchTokens
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToProcess, tokensData])

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
    else if (badgeIsError || tokenIdsIsError || tokensDataIsError) {
      currentToastId.current = showErrorToast(
        'Error fetching Kleros token list'
      )
    }
    // Show success toast when all data is fetched successfully
    else if (isSuccess) {
      currentToastId.current = showBadgeSuccessToast('Retrieved badge tokens')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    badgeIsError,
    badgeIsLoading,
    tokenIdsIsError,
    tokenIdsIsLoading,
    tokensDataIsError,
    tokensDataIsLoading,
    isSuccess
  ])

  // Clean up the toast on unmount
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (currentToastId.current) {
      timeoutId = setTimeout(() => {
        toast.dismiss(currentToastId.current)
      }, 2000)
    }
    // Clear the timeout when the component unmounts
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return <div>TokenFetcher</div> // TODO: delete when working flawlessly
}

export default TokenFetcher

const ProcessTokensData = (
  tokensData: TokenData[] | undefined,
  setListTokens: React.Dispatch<React.SetStateAction<TokenDataArray>>,
  setRetrievedBadgeTokens: React.Dispatch<React.SetStateAction<boolean>>,
  setTokenContractConfigs: React.Dispatch<
    React.SetStateAction<TokenContractConfig[]>
  >,
  setShouldFetchBalances: React.Dispatch<React.SetStateAction<boolean>>,
  setShouldFetchTokens: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!tokensData) throw new Error('tokensData is undefined')
  const contractConfigs = tokensData.map((token) => ({
    address: token.addr,
    abi: erc20ABI
  }))
  setShouldFetchTokens(false)
  if (contractConfigs.length === 0) return
  setTokenContractConfigs(contractConfigs as TokenContractConfig[])
  const updatedListTokens = [ETHData, ...tokensData]
  setListTokens(updatedListTokens)
  setRetrievedBadgeTokens(true)
  setShouldFetchBalances(true)
}
