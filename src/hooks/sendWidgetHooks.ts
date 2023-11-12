// sendWidgetHooks.ts
import { useEffect } from 'react'
import { Address, getAddress } from 'viem'
import { useEnsAddress, useNetwork } from 'wagmi'
import { useSendWidgetContext } from '../contexts/sendWidgetContext'

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
  // const { showErrorToast, showInfoToast } = useTransactionToast()

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
  const { chain } = useNetwork()

  const { data, refetch } = useEnsAddress({
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
  }, [data, setIsValidAddress, setValidAddress, setIsValidENS])

  useEffect(() => {
    if (chain?.id === 31337) {
      setIsValidENS(true)
      setIsValidAddress(true)
      setValidAddress(addressInputValue as Address)
      return
    }
  }, [
    chain,
    setIsValidAddress,
    setValidAddress,
    setIsValidENS,
    addressInputValue
  ])
}
