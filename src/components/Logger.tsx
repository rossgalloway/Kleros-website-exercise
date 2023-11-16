import { useEffect } from 'react'
import { useDappContext } from '../contexts/dAppContext'
import { useSendWidgetContext } from '../contexts/sendWidgetContext'

export default function Logger() {
  const { listTokens, retrievedWalletBalances, retrievedBadgeTokens } =
    useDappContext()
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

  return null
}
