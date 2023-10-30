import { forwardRef } from 'react'
import { Button, Responsive, Text } from '@radix-ui/themes'
import { ChevronDownIcon } from '@radix-ui/react-icons'

interface TokenSelectorButtonProps {
  size?: Responsive<'1' | '2' | '3' | '4'>
}

const TokenSelectorButton = forwardRef(
  (props: TokenSelectorButtonProps, ref: any) => {
    const { size, ...restProps } = props
    return (
      <Button
        ref={ref}
        className="token-selector-button"
        size={size}
        radius="full"
        {...restProps}
      >
        <div className="placeholder-circle"></div>
        <Text>Token</Text>
        <ChevronDownIcon />
      </Button>
    )
  }
)

export default TokenSelectorButton
