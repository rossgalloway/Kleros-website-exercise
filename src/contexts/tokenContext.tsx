import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  type TokenDataArray,
  TokenContractConfig
} from '../types/tokenListTypes'

interface TokenContextProps {
  listTokens: TokenDataArray
  setListTokens: React.Dispatch<React.SetStateAction<TokenDataArray>>
  tokenContractConfigs: TokenContractConfig[]
  setTokenContractConfigs: React.Dispatch<
    React.SetStateAction<TokenContractConfig[]>
  >
  retrievedWalletBalances: boolean
  setRetrievedWalletBalances: React.Dispatch<React.SetStateAction<boolean>>
  retrievedBadgeTokens: boolean
  setRetrievedBadgeTokens: React.Dispatch<React.SetStateAction<boolean>>
  shouldFetchTokens: boolean
  setShouldFetchTokens: React.Dispatch<React.SetStateAction<boolean>>
}

// Create a context with a default value
const TokenContext = createContext<TokenContextProps | undefined>(undefined)

interface TokenProviderProps {
  children: ReactNode
}

// Create a provider component
export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [listTokens, setListTokens] = useState<TokenDataArray>([])
  const [tokenContractConfigs, setTokenContractConfigs] = useState<
    TokenContractConfig[]
  >([])
  const [retrievedWalletBalances, setRetrievedWalletBalances] =
    useState<boolean>(false)
  const [retrievedBadgeTokens, setRetrievedBadgeTokens] =
    useState<boolean>(false)
  const [shouldFetchTokens, setShouldFetchTokens] = useState<boolean>(true)

  return (
    <TokenContext.Provider
      value={{
        listTokens,
        setListTokens,
        tokenContractConfigs,
        setTokenContractConfigs,
        retrievedWalletBalances,
        setRetrievedWalletBalances,
        retrievedBadgeTokens,
        setRetrievedBadgeTokens,
        shouldFetchTokens,
        setShouldFetchTokens
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

// Create a custom hook to use the context
export const useTokens = (): TokenContextProps => {
  const context = useContext(TokenContext)
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider')
  }
  return context
}
