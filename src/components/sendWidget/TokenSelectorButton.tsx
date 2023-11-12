import React from 'react'
import { forwardRef } from 'react'
import { Button, Responsive, Text } from '@radix-ui/themes'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useAccount } from 'wagmi'
import { useSendWidgetContext } from '../../contexts/sendWidgetContext'

interface TokenSelectorButtonProps {
  size?: Responsive<'1' | '2' | '3' | '4'>
}

const TokenSelectorButton = forwardRef<
  HTMLButtonElement,
  TokenSelectorButtonProps
>((props, ref) => {
  const { size, ...restProps } = props
  const { selectedToken } = useSendWidgetContext()
  const { isConnected } = useAccount()

  const displayToken = selectedToken || {
    ticker: 'ETH'
  }

  const imgSrc =
    displayToken.ticker === 'ETH'
      ? 'eth_logo.png'
      : `https://ipfs.kleros.io${displayToken.symbolMultihash}`

  return (
    <Button
      ref={ref}
      className="token-selector-button"
      size={size}
      radius="full"
      {...restProps}
      disabled={!isConnected}
    >
      <div className="token-logo">
        <img src={imgSrc} alt={displayToken.ticker} />
      </div>
      <Text className="mini-title" style={{ fontSize: '16px', padding: 0 }}>
        {displayToken.ticker}
      </Text>
      <ChevronDownIcon />
    </Button>
  )
})

TokenSelectorButton.displayName = 'TokenSelectorButton'

export default TokenSelectorButton
