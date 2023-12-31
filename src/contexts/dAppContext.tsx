import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react'
import {
  type TokenDataArray,
  TokenContractConfig
} from '../types/tokenListTypes'
import {
  serializeWithBigInt,
  deserializeWithBigInt
} from '../utils/serializeBigInt'
import {
  Transaction,
  TransactionResult
} from '../types/transactionComponentTypes'

interface DappContextProps {
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
  activeTransactions: Transaction[]
  setActiveTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  completedTransactions: TransactionResult[]
  setCompletedTransactions: React.Dispatch<
    React.SetStateAction<TransactionResult[]>
  >
  shouldFetchTokens: boolean
  setShouldFetchTokens: React.Dispatch<React.SetStateAction<boolean>>
  shouldFetchBalances: boolean
  setShouldFetchBalances: React.Dispatch<React.SetStateAction<boolean>>
}

// Create a context with a default value
const DappContext = createContext<DappContextProps | undefined>(undefined)

interface TokenProviderProps {
  children: ReactNode
}

// Create a provider component
export const DappProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const getInitialListTokens = () => {
    const storedListTokens = localStorage.getItem('listTokens')
    if (storedListTokens === undefined || null) {
      console.log('storedListTokens is undefined or null')
      return []
    }
    try {
      return deserializeWithBigInt(storedListTokens as string, [
        'decimals',
        'balance'
      ]) as TokenDataArray
    } catch (error) {
      console.error('Error parsing storedSelectedToken', error)
      return []
    }
  }

  const [listTokens, setListTokens] = useState<TokenDataArray>(
    getInitialListTokens()
  )
  const [tokenContractConfigs, setTokenContractConfigs] = useState<
    TokenContractConfig[]
  >([])
  const [retrievedWalletBalances, setRetrievedWalletBalances] =
    useState<boolean>(false)
  const [retrievedBadgeTokens, setRetrievedBadgeTokens] =
    useState<boolean>(false)
  const [activeTransactions, setActiveTransactions] = useState<Transaction[]>(
    []
  )
  const [completedTransactions, setCompletedTransactions] = useState<
    TransactionResult[]
  >([])
  const [shouldFetchTokens, setShouldFetchTokens] = useState<boolean>(true)
  const [shouldFetchBalances, setShouldFetchBalances] = useState<boolean>(false)

  // Update local storage when listTokens changes
  useEffect(() => {
    localStorage.setItem('listTokens', serializeWithBigInt(listTokens))
  }, [listTokens])

  useEffect(() => {
    localStorage.setItem(
      'activeTransactions',
      serializeWithBigInt(activeTransactions)
    )
  }, [activeTransactions])

  return (
    <DappContext.Provider
      value={{
        listTokens,
        setListTokens,
        tokenContractConfigs,
        setTokenContractConfigs,
        retrievedWalletBalances,
        setRetrievedWalletBalances,
        retrievedBadgeTokens,
        setRetrievedBadgeTokens,
        activeTransactions,
        setActiveTransactions,
        completedTransactions,
        setCompletedTransactions,
        shouldFetchTokens,
        setShouldFetchTokens,
        shouldFetchBalances,
        setShouldFetchBalances
      }}
    >
      {children}
    </DappContext.Provider>
  )
}

// Create a custom hook to use the context
export const useDappContext = (): DappContextProps => {
  const context = useContext(DappContext)
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider')
  }
  return context
}
