export type TokenObject =
  | {
      ID: string
      name: string
      ticker: string
      addr: string
      symbolMultihash: string
      status: number
      decimals: bigint
    }[]
  | undefined[]
