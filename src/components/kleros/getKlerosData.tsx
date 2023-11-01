import { useEffect, useState } from 'react'
import { BaseError } from 'viem'
import { type Address, useContractRead, erc20ABI } from 'wagmi'
import { badgeContractConfig, tokensViewContractConfig } from './abis'
import { Button } from '@radix-ui/themes'
import { useTokens } from '../../contexts/tokenContext'
import {
  type TokenDataArray,
  TokenData,
  TokenContractConfig
} from '../../types/tokenListTypes'
import { ETHData } from '../../contexts/tokenContext'

type Filter = readonly [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
]

export function QueryBadges() {
  const [badgeAddresses, setBadgeAddresses] = useState<Address[]>([])
  const [tokenIds, setTokenIds] = useState<readonly Address[]>([])
  const zeroAddress: Address = '0x0000000000000000000000000000000000000000'
  const t2crAddr: Address = '0xebcf3bca271b26ae4b162ba560e243055af0e679'

  Badges_queryAddresses(badgeAddresses, setBadgeAddresses, zeroAddress)
  getTokensIDsForAddresses(tokenIds, setTokenIds, badgeAddresses, t2crAddr)
  getTokens(tokenIds, t2crAddr, zeroAddress)

  return null
}

function Badges_queryAddresses(
  badgeAddresses: Address[],
  setBadgeAddresses: (badgeAddresses: Address[]) => void,
  zeroAddress: Address
) {
  const filter: Filter = [
    false, // Do not include items which are not on the TCR.
    true, // Include registered items.
    false, // Do not include items with pending registration requests.
    true, // Include items with pending clearing requests.
    false, // Do not include items with challenged registration requests.
    true, // Include items with challenged clearing requests.
    false, // Include token if caller is the author of a pending request.
    false // Include token if caller is the challenger of a pending request.
  ] as const

  const { data, isRefetching, refetch } = useContractRead({
    ...badgeContractConfig,
    functionName: 'queryAddresses',
    args: [zeroAddress, BigInt(1000), filter, true],
    select: (data) => {
      const [addresses] = data // Destructure to get the first element of the tuple
      return addresses.filter((address) => address !== zeroAddress)
    }
  })
  useEffect(() => {
    if (data !== undefined) {
      setBadgeAddresses(data)
      console.log('Addresses with badge: ', data)
    }
  }, [data])
}

function getTokensIDsForAddresses(
  tokenIds: readonly Address[],
  setTokenIds: (tokenIds: readonly Address[]) => void,
  badgeAddresses: Address[],
  t2crAddr: Address
) {
  const { data, isRefetching, refetch } = useContractRead({
    ...tokensViewContractConfig,
    functionName: 'getTokensIDsForAddresses',
    args: [t2crAddr, badgeAddresses]
  })
  useEffect(() => {
    if (data !== undefined) {
      setTokenIds(data)
      console.log('token IDs: ', data)
    }
  }, [data])
}

function getTokens(
  tokenIds: readonly Address[],
  t2crAddr: Address,
  zeroAddress: Address
) {
  const { listTokens, setListTokens, setTokenContractConfigs } = useTokens()
  const { data, isRefetching, refetch } = useContractRead({
    ...tokensViewContractConfig,
    functionName: 'getTokens',
    args: [t2crAddr, tokenIds],
    select: (data) => {
      return data.filter((token) => token.addr !== zeroAddress)
    }
  })
  useEffect(() => {
    if (data !== undefined) {
      const contractConfigs: TokenContractConfig[] = []
      for (const token of data) {
        const tokenContractConfig = {
          address: token.addr,
          abi: erc20ABI
        } as const
        contractConfigs.push(tokenContractConfig)
      }
      setTokenContractConfigs(contractConfigs)
      const updatedListTokens: TokenDataArray = [ETHData, ...data]
      setListTokens(updatedListTokens)
      console.log('Listed Tokens: ', updatedListTokens)
      console.log('Token Contract Configs: ', contractConfigs)
    }
  }, [data])
}

//   return (
//     <>
//       <div className="fetch-tokens">
//         <h1 className="h3 mb-3 font-weight-normal">
//           Tokens with the ERC20 Standard badge
//         </h1>
//         <br />
//       </div>
//       {/* {isFetching && (
//       <Spinner fadeIn="quarter" name="ball-pulse-sync" color="blue" />
//     )} */}
//       {Array.isArray(listTokens) && (
//         <div className="output">
//           {/* <pre id="data-display">
//             {JSON.stringify(
//               listTokens,
//               (key, value) =>
//                 typeof value === 'bigint' ? value.toString() : value,
//               2
//             )}
//           </pre> */}
//           <div id="symbols">
//             {listTokens.map((token, i) => {
//               if (token) {
//                 // console.log('token: ', token)
//                 const { ID, addr, symbolMultihash } = token
//                 return (
//                   <a href={`https://etherscan.io/address/${addr}`} key={i}>
//                     <img
//                       key={ID}
//                       src={`https://ipfs.kleros.io${symbolMultihash}`}
//                       className="img-thumbnail symbol"
//                       alt="symbol"
//                     />
//                   </a>
//                 )
//               }
//             })}
//           </div>
//         </div>
//       )}
//     </>
//   )
