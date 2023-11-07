// sendWidgetHooks.ts
import { useEffect } from 'react'
import { useSendWidgetContext } from './sendWidgetContext'
import { Address, getAddress } from 'viem'
import { useAccount, useEnsAddress } from 'wagmi'
import { TokenData, TokenDataArray } from '../../types/tokenListTypes'
import { useTokens } from '../../contexts/tokenContext'

/**
 * @description upon selecting a new token to send, this function resets the input values to 0
 * @dependencies `selectedToken`, `setTokenQtyInputValue`, `setFormattedTokenQty`
 */
export const useTokenQtyReset = () => {
  const { selectedToken, setTokenQtyInputValue, setFormattedTokenQty } =
    useSendWidgetContext()

  useEffect(() => {
    setTokenQtyInputValue('')
    setFormattedTokenQty(0n)
  }, [selectedToken, setTokenQtyInputValue, setFormattedTokenQty])
}

/**
 * @description this function checks if the user has sufficient balance to send the selected token
 * @dependencies `tokenQtyInputValue`
 */
export const useCheckSufficientBalance = () => {
  const {
    selectedToken,
    formattedTokenQty,
    tokenQtyInputValue,
    setIsSufficientBalance
  } = useSendWidgetContext()

  useEffect(() => {
    if (selectedToken?.balance) {
      if (formattedTokenQty > selectedToken?.balance) {
        setIsSufficientBalance(false)
      } else {
        setIsSufficientBalance(true)
      }
    }
  }),
    [tokenQtyInputValue]
}

/**
 * @description this function checks if the user-input address is a valid address.
 * @dependencies `addressInputValue`
 */
export const useValidateAddress = () => {
  const { addressInputValue, setIsValidAddress, setValidAddress, isValidENS } =
    useSendWidgetContext()

  useEffect(() => {
    try {
      if (isValidENS) return
      const validatedAddress = getAddress(addressInputValue)
      setIsValidAddress(true)
      setValidAddress(validatedAddress)
    } catch (e) {
      setIsValidAddress(false)
    }
  }),
    [addressInputValue]
}

/**
 * @description this function checks if the user-input address is a valid ENS name.
 */
export const useCheckEnsAddress = () => {
  const {
    addressInputValue,
    setIsValidAddress,
    setValidAddress,
    setIsValidENS
  } = useSendWidgetContext()

  const { data, isError, isSuccess, refetch } = useEnsAddress({
    name: addressInputValue,
    enabled: false
  })

  useEffect(() => {
    if (addressInputValue.endsWith('.eth')) {
      refetch()
    }
  }, [addressInputValue, refetch])

  useEffect(() => {
    if (!data) {
      setIsValidENS(false)
      setIsValidAddress(false)
      setValidAddress('0x000')
    }
    if (data) {
      setIsValidENS(true)
      setIsValidAddress(true)
      setValidAddress(data as Address)
    }
  }, [
    data,
    isError,
    isSuccess,
    setIsValidAddress,
    setValidAddress,
    setIsValidENS,
    addressInputValue
  ])
}

/**
 * @description this function flushes the user data when the user disconnects from the wallet
 * @dependencies `isConnected`
 */
export const useFlushSendWidget = () => {
  const { isConnected } = useAccount()
  const { listTokens, setListTokens, setRetrievedWalletBalances } = useTokens()
  const { setAddressInputValue, setSelectedToken } = useSendWidgetContext()

  useEffect(() => {
    setAddressInputValue('')

    if (isConnected === false && listTokens) {
      const flushedListTokens: TokenDataArray = listTokens.map((token) => {
        return { ...token, balance: 0n } as TokenData
      })
      setListTokens(flushedListTokens)
      setSelectedToken(flushedListTokens[0])
      setRetrievedWalletBalances(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])
}

/**
 * @description this function flushes the user data when the user switches wallets
 * @dependencies `address`
 */
export const useFlushWalletChange = () => {
  const { address } = useAccount()
  const { listTokens, setListTokens, setRetrievedWalletBalances } = useTokens()
  const { setAddressInputValue, setSelectedToken } = useSendWidgetContext()

  useEffect(() => {
    setAddressInputValue('')

    const flushedListTokens: TokenDataArray = listTokens.map((token) => {
      return { ...token, balance: 0n } as TokenData
    })
    setListTokens(flushedListTokens)
    setSelectedToken(flushedListTokens[0])
    setRetrievedWalletBalances(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])
}
