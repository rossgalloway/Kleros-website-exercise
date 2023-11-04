// sendWidgetHooks.ts
import { useEffect } from 'react'
import { useSendWidgetContext } from './sendWidgetContext'
import { Address, getAddress } from 'viem'
import { useAccount, useEnsAddress } from 'wagmi'
import { TokenData, TokenDataArray } from '../../types/tokenListTypes'
import { useTokens } from '../../contexts/tokenContext'

export const useTokenQtyReset = () => {
  const { selectedToken, setTokenQtyInputValue, setFormattedTokenQty } =
    useSendWidgetContext()

  useEffect(() => {
    setTokenQtyInputValue('')
    setFormattedTokenQty(0n)
  }, [selectedToken, setTokenQtyInputValue, setFormattedTokenQty])
}

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

export const useCheckEnsAddress = () => {
  const {
    addressInputValue,
    setIsValidAddress,
    setValidAddress,
    setIsValidENS
  } = useSendWidgetContext()

  const { data, isError, isSuccess } = useEnsAddress({
    name: addressInputValue
  })
  if (isSuccess) {
    setIsValidENS(true)
    setIsValidAddress(true)
    setValidAddress(data as Address)
  } else if (isError) {
    setIsValidAddress(false)
  }
}

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
