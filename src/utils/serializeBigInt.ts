import { TokenData, TokenDataArray } from '../types/tokenListTypes'

export function serializeWithBigInt(obj: TokenData | TokenDataArray): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

export function deserializeWithBigInt(
  json: string,
  bigintFields: string[]
): TokenData | TokenDataArray {
  try {
    JSON.parse(json)
  } catch (e) {
    throw new Error('Invalid JSON string')
  }

  return JSON.parse(json, (key, value) => {
    if (bigintFields.includes(key)) {
      return BigInt(value)
    }
    return value
  })
}

// export function deserializeWithBigInt(
//   json: string,
//   bigintFields: string[]
// ): TokenData | TokenDataArray {
//   return JSON.parse(json, (key, value) => {
//     if (bigintFields.includes(key)) {
//       return BigInt(value)
//     }
//     return value
//   })
// }
