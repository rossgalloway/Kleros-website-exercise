import { type FetchBalanceResult } from '@wagmi/core'

export type ercBalanceData =
  | (
      | {
          address: `0x${string}`
          error?: Error
          result?: undefined
          status: 'failure'
        }
      | {
          address: `0x${string}`
          error?: undefined
          result: unknown
          status: 'success'
        }
    )[]
  | undefined
export type ethBalanceData = FetchBalanceResult | undefined
