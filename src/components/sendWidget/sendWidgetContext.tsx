// sendWidgetContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react'
import { Address } from 'wagmi'
import { TokenData } from '../../types/tokenListTypes'
import { ETHData } from '../constants'

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
  const [selectedToken, setSelectedToken] = useState<TokenData>(ETHData)
  const [tokenQtyInputValue, setTokenQtyInputValue] = useState('')
  const [formattedTokenQty, setFormattedTokenQty] = useState<bigint>(0n)
  const [addressInputValue, setAddressInputValue] = useState('')
  const [isValidAddress, setIsValidAddress] = useState(false)
  const [isValidENS, setIsValidENS] = useState(false)
  const [validAddress, setValidAddress] = useState<Address>('0x0000') //check this default value
  const [isSufficientBalance, setIsSufficientBalance] = useState(false)

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
        setIsValidENS
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
