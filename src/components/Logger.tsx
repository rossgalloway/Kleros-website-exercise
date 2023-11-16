import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useDappContext } from '../contexts/dAppContext'
import { useSendWidgetContext } from '../contexts/sendWidgetContext'

export default function Logger() {
  const { address } = useAccount()
  const {
    listTokens,
    retrievedWalletBalances,
    retrievedBadgeTokens,
    activeTransactions,
    completedTransactions
  } = useDappContext()
  const { selectedToken } = useSendWidgetContext()

  useEffect(() => {
    console.log('@logger - listTokens updated: ', listTokens)
  }, [listTokens])

  useEffect(() => {
    console.log('@logger - selected token updated: ', selectedToken)
  }, [selectedToken])

  useEffect(() => {
    console.log(
      '@logger - retrievedWalletBalances updated: ',
      retrievedWalletBalances
    )
  }, [retrievedWalletBalances])

  useEffect(() => {
    console.log(
      '@logger - retrievedBadgeTokens updated: ',
      retrievedBadgeTokens
    )
  }, [retrievedBadgeTokens])

  useEffect(() => {
    console.log('@logger - address updated: ', address)
  }, [address])

  useEffect(() => {
    console.log('active transactions: ', activeTransactions)
  }, [activeTransactions])

  useEffect(() => {
    console.log('completed transactions: ', completedTransactions)
  }, [completedTransactions])

  return null
}
