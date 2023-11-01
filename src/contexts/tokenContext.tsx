import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  type TokenDataArray,
  TokenData,
  TokenContractConfig
} from '../types/tokenListTypes'

interface TokenContextProps {
  listTokens: TokenDataArray | null
  setListTokens: React.Dispatch<React.SetStateAction<TokenDataArray | null>>
  selectedToken: TokenData
  setSelectedToken: React.Dispatch<React.SetStateAction<TokenData>>
  tokenContractConfigs: TokenContractConfig[]
  setTokenContractConfigs: React.Dispatch<
    React.SetStateAction<TokenContractConfig[]>
  >
}

export const ETHData: TokenData = {
  ID: 'null',
  name: 'Ethereum',
  ticker: 'ETH',
  addr: '0xNull',
  symbolMultihash: 'null',
  status: 1,
  decimals: 18n
}

// Create a context with a default value
const TokenContext = createContext<TokenContextProps | null>(null)

interface TokenProviderProps {
  children: ReactNode
}

// Create a provider component
export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [listTokens, setListTokens] = useState<TokenDataArray | null>(null)
  const [selectedToken, setSelectedToken] = useState<TokenData>(ETHData)
  const [tokenContractConfigs, setTokenContractConfigs] = useState<
    TokenContractConfig[]
  >([])
  return (
    <TokenContext.Provider
      value={{
        listTokens,
        setListTokens,
        selectedToken,
        setSelectedToken,
        tokenContractConfigs,
        setTokenContractConfigs
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
