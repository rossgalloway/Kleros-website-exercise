import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Text } from '@radix-ui/themes'
import Spinner from 'react-spinkit'
import TokenSelectorButton from './TokenSelectorButton'
import { useTokens } from '../contexts/tokenContext'
import { type TokenData } from '../types/tokenListTypes'
import './TokenSelectorDialog.css'
import { useRef, useState } from 'react'
import { format } from 'util'

const TokenSelectorDialog = () => {
  const { listTokens, selectedToken, setSelectedToken } = useTokens()
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
          {/* <Dialog.Description className="DialogDescription">
            Select the token you want to send
          </Dialog.Description> */}
          <div className="TokenList">
            {finalSortedTokens?.map((token, index) => {
              if (!token) return null
              const { name, ticker, symbolMultihash, ID, balance, decimals } =
                token
              const formattedBalance = Number(balance) / 10 ** Number(decimals)
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

export default TokenSelectorDialog
