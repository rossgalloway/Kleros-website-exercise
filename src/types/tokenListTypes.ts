// src/types/tokenListTypes.ts

import { type Address } from 'wagmi'

export type TokenDataArray = TokenData[] | undefined[]

export type TokenData = {
  ID: string
  name: string
  ticker: string
  addr: Address
  symbolMultihash: string
  status: number
  decimals: bigint
  balance?: bigint
}

export type TokenContractConfig = {
  address: Address
  abi: never
}
