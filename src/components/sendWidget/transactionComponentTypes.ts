import { Hash, type Address, type TransactionReceipt } from 'viem'

export type EthSendParams = {
  // Define the structure of your transaction details here
  // For example:
  to: Address
  value: bigint
}

export type TransactionResult = {
  status: 'success' | 'error'
  receipt?: TransactionReceipt // Replace 'any' with the type of your transaction receipt
  error?: Error | null
  id: Hash
}

export type Transaction = {
  id: string
  details: TransactionPayload
  hash?: Hash
}

export type TransactionComponentProps = {
  id: string
  type: PayloadType
  transactionDetails: TransactionPayload
  onTransactionComplete: (result: TransactionResult) => void
  activeTransactions?: Transaction[]
}

export enum PayloadType {
  EthPayload,
  ErcPayload
}

export type EthPayload = {
  type: PayloadType.EthPayload
  token?: Address
  to: Address
  value: bigint
}

export type ErcPayload = {
  type: PayloadType.ErcPayload
  token: Address
  to: Address
  value: bigint
}

export type TransactionPayload = EthPayload | ErcPayload
