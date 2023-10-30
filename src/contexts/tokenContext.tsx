import React, { createContext, useContext, useState, ReactNode } from 'react'
import { type TokenObject } from '../types/tokenList'

interface TokenContextProps {
  listTokens: TokenObject | null
  setListTokens: React.Dispatch<React.SetStateAction<TokenObject | null>>
}

// Create a context with a default value
const TokenContext = createContext<TokenContextProps | null>(null)

interface TokenProviderProps {
  children: ReactNode
}

// Create a provider component
export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [listTokens, setListTokens] = useState<TokenObject | null>(null)
  return (
    <TokenContext.Provider value={{ listTokens, setListTokens }}>
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
