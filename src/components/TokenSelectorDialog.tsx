import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import TokenSelectorButton from './TokenSelectorButton'
import { useTokens } from '../contexts/tokenContext'
import './TokenSelectorDialog.css'

const TokenSelectorDialog = () => {
  const { listTokens } = useTokens()

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <TokenSelectorButton size="3" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Select a Token</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Select the token you want to send
          </Dialog.Description>
          <div className="TokenList">
            {listTokens?.map((token, index) => {
              if (!token) return null
              const { ticker, symbolMultihash, ID } = token
              return (
                <div
                  key={ID}
                  className="TokenItem"
                  onClick={() => {
                    // Handle token selection here
                  }}
                >
                  <img
                    src={`https://ipfs.kleros.io${symbolMultihash}`}
                    alt={ticker}
                    className="img-thumbnail symbol"
                  />
                  <span>{ticker}</span>
                  {/* Placeholder for quantity in user wallet */}
                  <span className="TokenQuantity">10</span>
                </div>
              )
            })}
          </div>

          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// const TokenSelectorDialog = () => (
//   <Dialog.Root>
//     <Dialog.Trigger asChild>
//       <TokenSelectorButton size="3" />
//       {/* <button className="Button violet">Edit profile</button> */}
//     </Dialog.Trigger>
//     <Dialog.Portal>
//       <Dialog.Overlay className="DialogOverlay" />
//       <Dialog.Content className="DialogContent">
//         <Dialog.Title className="DialogTitle">Select a Token</Dialog.Title>
//         <Dialog.Description className="DialogDescription">
//           Select the token you want to send
//         </Dialog.Description>
//         {/* for each token, a clickable div with the token symbol derived from the symbolMultihash
//         and token name on the left and the quantity in the user wallet (placeholder for now).
//         The div should highlight with mouse-over. */}
//         <Dialog.Close asChild>
//           <button className="IconButton" aria-label="Close">
//             <Cross2Icon />
//           </button>
//         </Dialog.Close>
//       </Dialog.Content>
//     </Dialog.Portal>
//   </Dialog.Root>
// )

export default TokenSelectorDialog
