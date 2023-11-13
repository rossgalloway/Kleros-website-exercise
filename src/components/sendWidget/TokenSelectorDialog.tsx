import React from 'react'
import { useRef, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Text } from '@radix-ui/themes'
import Spinner from 'react-spinkit'
import TokenSelectorButton from './TokenSelectorButton'

import { useDappContext } from '../../contexts/dAppContext'
import { useSendWidgetContext } from '../../contexts/sendWidgetContext'

import { type TokenData } from '../../types/tokenListTypes'
import './TokenSelectorDialog.css'

const TokenSelectorDialog = () => {
  const { listTokens } = useDappContext()
  const { setSelectedToken } = useSendWidgetContext()
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageLoaded(false)
    console.log('Image failed to load')
  }

  const handleTokenSelect = (token: TokenData) => {
    setSelectedToken(token)
    closeRef.current?.click()
  }

  const sortedTokens = listTokens?.slice(1).sort((a, b) => {
    if (!a || !b) return 0
    return Number(b.balance) - Number(a.balance)
  })
  const finalSortedTokens = [listTokens?.[0], ...(sortedTokens || [])].filter(
    Boolean
  )

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <TokenSelectorButton size="3" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Select a Token</Dialog.Title>
          <div className="TokenList">
            {finalSortedTokens?.map((token) => {
              if (!token) return null
              const { name, ticker, symbolMultihash, ID, balance, decimals } =
                token
              const formattedBalance =
                balance === 0n
                  ? 0
                  : toMaxFixed(Number(balance) / 10 ** Number(decimals), 5)
              return (
                <div
                  key={ID}
                  className="TokenItem"
                  onClick={() => handleTokenSelect(token)}
                >
                  {ticker === 'ETH' ? (
                    <img
                      src="eth_logo.png"
                      alt={ticker}
                      className="img-thumbnail symbol"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  ) : (
                    <>
                      {!imageLoaded && (
                        <Spinner
                          name="circle"
                          style={{ paddingLeft: '20px' }}
                        />
                      )}
                      <img
                        src={`https://ipfs.kleros.io${symbolMultihash}`}
                        alt={ticker}
                        className="img-thumbnail symbol"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        style={{ display: imageLoaded ? 'inline' : 'none' }}
                      />
                    </>
                  )}
                  <span>
                    <div className="tokenTicker">{ticker}</div>
                    <div className="tokenName">{name}</div>
                  </span>
                  {/* Placeholder for quantity in user wallet */}
                  <span className="TokenQuantity">
                    <Text>{formattedBalance}</Text>
                  </span>
                </div>
              )
            })}
          </div>

          <Dialog.Close ref={closeRef} asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function toMaxFixed(num: number, maxDecimals: number): string {
  const regExp = new RegExp(`^-?\\d+(?:.\\d{0,${maxDecimals}})?`)
  const match = num.toString().match(regExp)
  if (match) {
    return match[0]
  } else {
    return num.toString()
  }
}

export default TokenSelectorDialog
