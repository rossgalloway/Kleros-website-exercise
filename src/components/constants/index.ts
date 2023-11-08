import { TokenData } from '../../types/tokenListTypes'

export const ETHData: TokenData = {
  ID: 'null',
  name: 'Ethereum',
  ticker: 'ETH',
  addr: '0xNull',
  symbolMultihash: 'null',
  status: 1,
  decimals: 18n,
  balance: 0n
}

export const hardcodedGoerliData: TokenData[] = [
  {
    ID: '0x0d9e613d49ecce812058d8a612d61c94f13111ebc4cc3122deebf4e720ae9058',
    name: 'WETH',
    ticker: 'WETH',
    addr: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6 ',
    symbolMultihash:
      '/ipfs/QmRyTdB5Cc7zH7G4YwWs7jh98zNGLQN1NfJ8KTWTXikhcP/WETH',
    status: 1,
    decimals: 18n,
    balance: 0n
  }
]
