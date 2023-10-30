import React, { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'
import Spinner from 'react-spinkit'

import { badgeABI, tokensViewABI } from './abis'

type TokenData = {
  [address: string]: any[]
}
type Filter = boolean[]
type TokenTuple = [
  string, // ID
  string, // name
  string, // ticker
  string, // addr
  string, // symbolMultihash
  number, // status
  number // decimals
]
type FetchedTokensType = TokenTuple[]

export const GetTokenInfo: React.FC = () => {
  const [tokenData, setTokenData] = useState<TokenTuple | null>(null)
  const [isFetching, setIsFetching] = useState<boolean | null>(null)
  const badgeAbiConst = badgeABI as const

  const zeroAddress: string = '0x0000000000000000000000000000000000000000'
  const filter: Filter = [
    false, // Do not include items which are not on the TCR.
    true, // Include registered items.
    false, // Do not include items with pending registration requests.
    true, // Include items with pending clearing requests.
    false, // Do not include items with challenged registration requests.
    true, // Include items with challenged clearing requests.
    false, // Include token if caller is the author of a pending request.
    false // Include token if caller is the challenger of a pending request.
  ]

  // Assumes you have a connected wallet set to mainnet.
  const t2crAddr: string = '0xebcf3bca271b26ae4b162ba560e243055af0e679'
  const erc20BadgeAddr: string = '0xCb4Aae35333193232421E86Cd2E9b6C91f3B125F'
  const tokensViewAddr: string = '0xf9b9b5440340123b21bff1ddafe1ad6feb9d6e7f'

  const addressesWithBadge = useContractRead({
    address: erc20BadgeAddr as `0x${string}`,
    abi: badgeABI as const,
    functionName: 'queryAddresses',
    args: [zeroAddress, 1000, filter, true]
    // select: (data: any) =>
    //   data.values.filter((address: string) => address !== zeroAddress)
  })
  console.log('addressesWithBadge: ', addressesWithBadge)

  const submissionIDs = useContractRead({
    address: tokensViewAddr as `0x${string}`,
    abi: tokensViewABI,
    functionName: 'getTokensIDsForAddresses',
    args: [t2crAddr, addressesWithBadge]
  })
  console.log('submissionIDs: ', submissionIDs)

  const fetchedTokens = useContractRead({
    address: tokensViewAddr as `0x${string}`,
    abi: tokensViewABI,
    functionName: 'getTokens',
    args: [t2crAddr, submissionIDs]
  })
  console.log('fetchedTokens: ', fetchedTokens)

  // useEffect(() => {
  //   if (fetchedTokens) {
  //     setIsFetching(true)
  //     try {
  //       const typedFetchedTokens = fetchedTokens as unknown as FetchedTokensType
  //       const filteredTokens = FetchedTokens
  //         .filter((tokenTuple) => tokenTuple[3] !== zeroAddress)
  //         .reduce((acc, curr) => ({ ...acc, [curr[3]]: curr }), {})
  //       setTokenData(filteredTokens)
  //     } catch (err) {
  //       console.error(err)
  //     } finally {
  //       setIsFetching(false)
  //     }
  //   }
  // }, [fetchedTokens])

  return (
    <div className="text-center body">
      {/* <div id="metamask-loaded">
        <div className="fetch-tokens">
          <h1 className="h3 mb-3 font-weight-normal">
            Tokens with the ERC20 Standard badge
          </h1>
          <br />
        </div>
        {isFetching && (
          <Spinner fadeIn="quarter" name="ball-pulse-sync" color="blue" />
        )}
        {tokenData && (
          <div className="output">
            <pre id="data-display">{JSON.stringify(tokenData, null, 2)}</pre>
            <div id="symbols">
              {Object.keys(tokenData).map((address, i) => {
                const ID = tokenData[address][0]
                const symbolMultihash = tokenData[address][4]
                return (
                  <a href={`https://etherscan.io/address/${address}`} key={i}>
                    <img
                      key={ID}
                      src={`https://ipfs.kleros.io${symbolMultihash}`}
                      className="img-thumbnail symbol"
                      alt="symbol"
                    />
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div> */}
    </div>
  )
}

export default GetTokenInfo

// import React, { useEffect, useState } from 'react'
// import { useContractRead } from 'wagmi'
// import Spinner from 'react-spinkit'

// import { badgeABI, tokensViewABI } from './abis'

// // import './styles.css'

// export const GetTokenInfo = () => {
//   const [tokenData, setTokenData] = useState()
//   const [isFetching, setIsFetching] = useState()

// const zeroAddress = '0x0000000000000000000000000000000000000000'
// const filter = [
//   false, // Do not include items which are not on the TCR.
//   true, // Include registered items.
//   false, // Do not include items with pending registration requests.
//   true, // Include items with pending clearing requests.
//   false, // Do not include items with challenged registration requests.
//   true, // Include items with challenged clearing requests.
//   false, // Include token if caller is the author of a pending request.
//   false // Include token if caller is the challenger of a pending request.
// ]

// // Assumes you have a connected wallet set to mainnet.
// const t2crAddr = '0xebcf3bca271b26ae4b162ba560e243055af0e679'
// const erc20BadgeAddr = '0xCb4Aae35333193232421E86Cd2E9b6C91f3B125F'
// const tokensViewAddr = '0xf9b9b5440340123b21bff1ddafe1ad6feb9d6e7f'

//   useEffect(() => {
//     // const web3 = new Web3(window.ethereum)
//     // const badgeContract = getContract({
//     //   address: erc20BadgeAddr,
//     //   abi: badgeABI
//     // })
//     // We use a view contract to return all the
//     // available token data at once.
//     // Warning: Some token contracts do not implement the
//     // decimals function. For these cases the decimals field
//     // of the struct will be set to 0. Account for this
//     // if your dapp uses this field.
//     // const tokensViewContract = getContract({
//     //   address: tokensViewAddr,
//     //   abi: tokensViewABI
//     // })
//     setIsFetching(true)
//     ;(async () => {
//       try {
//         // Fetch addresses of tokens that have the badge.
//         // Since the contract returns fixed sized arrays, we must filter out unused items.
//         const addressesWithBadge = useContractRead({
//           address: erc20BadgeAddr,
//           abi: badgeABI,
//           functionName: 'queryAddresses',
//           args: [
//             zeroAddress,
//             1000, // Number of items to return at once.
//             filter,
//             true // Return oldest first.
//           ],
//           select: (data) =>
//             data.values.filter((address) => address !== zeroAddress),
//           onSuccess(data) {
//             console.log('Success', data)
//           },
//           onError(error) {
//             console.log('Error', error)
//           }
//         })
//         // const addressesWithBadge = (
//         //   await badgeContract.methods
//         //     .queryAddresses(
//         //       zeroAddress, // A token address to start/end the query from. Set to zero means unused.
//         //       1000, // Number of items to return at once.
//         //       filter,
//         //       true // Return oldest first.
//         //     )
//         //     .call()
//         // ).values.filter((address) => address !== zeroAddress)

//         // Fetch their submission IDs on the T2CR.
// const submissionIDs = useContractRead({
//   address: tokensViewAddr,
//   abi: tokensViewABI,
//   functionName: 'getTokensIDsForAddresses',
//   args: [t2crAddr, addressesWithBadge],
//   onSuccess(data) {
//     console.log('Success', data)
//   },
//   onError(error) {
//     console.log('Error', error)
//   }
//         })
//         // const submissionIDs = await tokensViewContract.methods
//         //   .getTokensIDsForAddresses(t2crAddr, addressesWithBadge)
//         //   .call()

//         // With the token IDs, get the information and add it to the object.
//         const fetchedTokens = useContractRead({
// address: tokensViewAddr,
// abi: tokensViewABI,
// functionName: 'getTokens',
// args: [t2crAddr, submissionIDs],
// select: (data) =>
//   data.values
//     .filter((tokenInfo) => tokenInfo[3] !== zeroAddress)
//     .reduce(
//       (acc, curr) => ({
//         ...acc,
//         [curr[3]]: curr
//       }),
//       {}
//     )
//         })
//         // const fetchedTokens = (
//         //   await tokensViewContract.methods
//         //     .getTokens(t2crAddr, submissionIDs)
//         //     .call()
//         // )
//         //   .filter((tokenInfo) => tokenInfo[3] !== zeroAddress)
//         //   .reduce(
//         //     (acc, curr) => ({
//         //       ...acc,
//         //       [curr[3]]: curr
//         //     }),
//         //     {}
//         //   )

//         // Important:
//         // The `decimals()` function of the ERC20 standard is optional, so some
//         // token contracts (like DigixDAO/DGD) may not implement it.
//         // In this cases, the tokensView.getTokens returns 0 in the decimals
//         // field of token struct. So if you plan on using it, you should
//         // plan accordingly and set the decimals value.
//         setTokenData(fetchedTokens)
//       } catch (err) {
//         console.error(err)
//       } finally {
//         setIsFetching(false)
//       }
//     })()
//   }, [])
