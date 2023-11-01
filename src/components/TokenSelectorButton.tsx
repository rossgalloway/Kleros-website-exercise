import { forwardRef } from 'react'
import { Button, Responsive, Text } from '@radix-ui/themes'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useTokens } from '../contexts/tokenContext'
import { useAccount } from 'wagmi'

interface TokenSelectorButtonProps {
  size?: Responsive<'1' | '2' | '3' | '4'>
}

const TokenSelectorButton = forwardRef(
  (props: TokenSelectorButtonProps, ref: any) => {
    const { size, ...restProps } = props
    const { selectedToken } = useTokens()
    const { isConnected } = useAccount()

    const displayToken = selectedToken || {
      ticker: 'ETH'
    }

    const imgSrc =
      displayToken.ticker === 'ETH'
        ? 'eth_logo.png'
        : `https://ipfs.kleros.io${(displayToken as any).symbolMultihash}`

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
          <img src={imgSrc}></img>
        </div>
        <Text className="mini-title" style={{ fontSize: '16px', padding: 0 }}>
          {displayToken.ticker}
        </Text>
        <ChevronDownIcon />
      </Button>
    )
  }
)

export default TokenSelectorButton
