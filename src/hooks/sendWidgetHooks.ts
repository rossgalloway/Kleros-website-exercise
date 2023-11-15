// sendWidgetHooks.ts
import { useEffect } from 'react'
import { Address, getAddress } from 'viem'
import { useEnsAddress, useNetwork } from 'wagmi'
import { useSendWidgetContext } from '../contexts/sendWidgetContext'

/**
 * @description this function checks if the user-input address is a valid address.
 * @dependencies `addressInputValue`
 */
export const useValidateAddress = () => {
  const { addressInputValue, isValidENS, setIsValidAddress, setValidAddress } =
    useSendWidgetContext()

  useEffect(() => {
    if (isValidENS) {
      setIsValidAddress(true)
      return
    }
    try {
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
  let EnsToCheck: string
  if (!addressInputValue) {
    EnsToCheck = ''
  } else {
    EnsToCheck = addressInputValue
  }

  const { data, refetch } = useEnsAddress({
    name: EnsToCheck,
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
