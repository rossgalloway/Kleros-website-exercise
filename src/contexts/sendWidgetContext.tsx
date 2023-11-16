// sendWidgetContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react'
import { type Address } from 'wagmi'
import { TokenData } from '../types/tokenListTypes'
import { ETHData } from '../constants/tokenConstants'
import {
  serializeWithBigInt,
  deserializeWithBigInt
} from '../utils/serializeBigInt'

interface SendWidgetContextType {
  selectedToken: TokenData
  setSelectedToken: React.Dispatch<React.SetStateAction<TokenData>>
  tokenQtyInputValue: string
  setTokenQtyInputValue: React.Dispatch<React.SetStateAction<string>>
  formattedTokenQty: bigint
  setFormattedTokenQty: React.Dispatch<React.SetStateAction<bigint>>
  addressInputValue: string
  setAddressInputValue: React.Dispatch<React.SetStateAction<string>>
  isValidAddress: boolean
  setIsValidAddress: React.Dispatch<React.SetStateAction<boolean>>
  validAddress: Address
  setValidAddress: React.Dispatch<React.SetStateAction<Address>>
  isSufficientBalance: boolean
  setIsSufficientBalance: React.Dispatch<React.SetStateAction<boolean>>
  isValidENS: boolean
  setIsValidENS: React.Dispatch<React.SetStateAction<boolean>>
  isValidValueInput: boolean
  setIsValidValueInput: React.Dispatch<React.SetStateAction<boolean>>
}

const SendWidgetContext = createContext<SendWidgetContextType | undefined>(
  undefined
)

interface SendWidgetProviderProps {
  children: ReactNode
}

export const SendWidgetProvider: React.FC<SendWidgetProviderProps> = ({
  children
}) => {
  const getInitialSelectedToken = () => {
    const storedSelectedToken = localStorage.getItem('selectedToken')
    if (storedSelectedToken === undefined || storedSelectedToken === null) {
      console.log('storedSelectedToken is undefined or null')
      return ETHData
    }
    try {
      return deserializeWithBigInt(storedSelectedToken as string, [
        'decimals',
        'balance'
      ]) as TokenData
    } catch (error) {
      console.error('Error parsing storedSelectedToken', error)
      return ETHData
    }
  }

  const getInitialTokenQtyInputValue = () => {
    const storedTokenQty = localStorage.getItem('tokenQtyInputValue')
    return storedTokenQty ? storedTokenQty : ''
  }

  const getInitialAddressInputValue = () => {
    const storedAddress = localStorage.getItem('addressInputValue')
    return storedAddress ? storedAddress : ''
  }

  const [selectedToken, setSelectedToken] = useState<TokenData>(
    getInitialSelectedToken()
  )
  const [tokenQtyInputValue, setTokenQtyInputValue] = useState<string>(
    getInitialTokenQtyInputValue()
  )
  const [formattedTokenQty, setFormattedTokenQty] = useState<bigint>(0n)
  const [addressInputValue, setAddressInputValue] = useState<string>(
    getInitialAddressInputValue()
  )
  const [isValidAddress, setIsValidAddress] = useState(false)
  const [isValidENS, setIsValidENS] = useState(false)
  const [validAddress, setValidAddress] = useState<Address>('0x000') //check this default value
  const [isSufficientBalance, setIsSufficientBalance] = useState(false)
  const [isValidValueInput, setIsValidValueInput] = useState(false)

  // Update local storage on state changes
  useEffect(() => {
    if (selectedToken === undefined || selectedToken === null) {
      setSelectedToken(ETHData)
    }
    localStorage.setItem('selectedToken', serializeWithBigInt(selectedToken))
  }, [selectedToken])

  useEffect(() => {
    localStorage.setItem('tokenQtyInputValue', tokenQtyInputValue)
  }, [tokenQtyInputValue])

  useEffect(() => {
    localStorage.setItem('addressInputValue', addressInputValue)
  }, [addressInputValue])

  return (
    <SendWidgetContext.Provider
      value={{
        selectedToken,
        setSelectedToken,
        tokenQtyInputValue,
        setTokenQtyInputValue,
        formattedTokenQty,
        setFormattedTokenQty,
        addressInputValue,
        setAddressInputValue,
        isValidAddress,
        setIsValidAddress,
        validAddress,
        setValidAddress,
        isSufficientBalance,
        setIsSufficientBalance,
        isValidENS,
        setIsValidENS,
        isValidValueInput,
        setIsValidValueInput
      }}
    >
      {children}
    </SendWidgetContext.Provider>
  )
}

export const useSendWidgetContext = (): SendWidgetContextType => {
  const context = useContext(SendWidgetContext)
  if (!context) {
    throw new Error('useSendWidget must be used within a SendWidgetProvider')
  }
  return context
}
