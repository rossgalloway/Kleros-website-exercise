import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  TextArea,
  TextField,
  Tooltip
} from '@radix-ui/themes'
import { Cross2Icon, CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import TokenSelectorDialog from './TokenSelectorDialog'
import {
  Address,
  useAccount,
  useContractWrite,
  useWaitForTransaction,
  erc20ABI,
  useSendTransaction
} from 'wagmi'
import { getAddress } from 'viem'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { useTokens } from '../contexts/tokenContext'
import { SendTransaction } from './wagmi/SendTransaction'
import { WriteContract } from './wagmi/WriteContract'
import { format } from 'util'
import { TokenData, TokenDataArray } from '../types/tokenListTypes'
import GetBalances from './getBalances'

export function SendWidget() {
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { listTokens, setListTokens, selectedToken, setSelectedToken } =
    useTokens()
  const [tokenQtyInputValue, setTokenQtyInputValue] = useState('')
  const [formattedTokenQty, setFormattedTokenQty] = useState<bigint>(0n)
  const [addressInputValue, setAddressInputValue] = useState('')
  const [isValidAddress, setIsValidAddress] = useState(false)
  const [validAddress, setValidAddress] = useState<Address>('0x0000') //check this default value
  const [isSufficientBalance, setIsSufficientBalance] = useState(false)
  const [showBalance, setShowBalance] = useState(false)
  //TODO: add ENS validation

  const handleTokenQtyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formattedValue = BigInt(
      Number(e.target.value) * 10 ** Number(selectedToken.decimals)
    )
    console.log(formattedValue)
    if (isConnected) {
      setTokenQtyInputValue(e.target.value)
      setFormattedTokenQty(formattedValue)
    }
  }

  const handleAddressInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (isConnected) {
      setAddressInputValue(e.target.value)
    }
  }

  const handleERC20SendClick = () => {
    writeErc20Transfer({
      args: [validAddress, formattedTokenQty]
    })
  }

  const handleETHSendClick = () => {
    sendTransaction({
      to: validAddress,
      value: formattedTokenQty
      //  value: parseEther(value)
    })
  }

  useEffect(() => {
    try {
      const validatedAddress = getAddress(addressInputValue)
      setIsValidAddress(true)
      setValidAddress(validatedAddress)
    } catch (e) {
      setIsValidAddress(false)
    }
  }),
    [addressInputValue]

  useEffect(() => {
    if (selectedToken?.balance) {
      if (formattedTokenQty > selectedToken?.balance) {
        setIsSufficientBalance(false)
      } else {
        setIsSufficientBalance(true)
      }
    }
  }),
    [tokenQtyInputValue]

  useEffect(() => {
    setTokenQtyInputValue('')
    setFormattedTokenQty(0n)
  }, [selectedToken])

  useEffect(() => {
    setAddressInputValue('')

    if (isConnected === false && listTokens) {
      const flushedListTokens: TokenDataArray = listTokens.map((token) => {
        return { ...token, balance: 0n } as TokenData
      })
      setListTokens(flushedListTokens)
      setSelectedToken(flushedListTokens[0])
      console.log('flushing Balance Values: ', flushedListTokens)
    }
  }, [isConnected])

  //TODO: do I move this to a separate file?
  let erc20ContractConfig = {
    address: selectedToken.addr,
    abi: erc20ABI
  } as const

  const {
    write: writeErc20Transfer,
    data: dataErc20Transfer,
    error: ercError,
    isLoading: ercIsLoading,
    isError: ercIsError
  } = useContractWrite({
    ...erc20ContractConfig,
    functionName: 'transfer',
    args: [validAddress, formattedTokenQty]
  })
  const {
    data: ercReceipt,
    isLoading: ercIsPending,
    isSuccess: ercIsSuccess
  } = useWaitForTransaction({ hash: dataErc20Transfer?.hash })

  const { data, error, isLoading, isError, sendTransaction } =
    useSendTransaction()
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess
  } = useWaitForTransaction({ hash: data?.hash })

  return (
    <Flex
      className="sendWidget"
      direction="column"
      align="center"
      justify="between"
      gap="3"
    >
      <Flex
        className="input-container"
        direction="column"
        align="center"
        gap="3"
      >
        <Flex className="token-input-box" direction="column" gap="3">
          <Flex className="token-input-element" justify="center">
            <Text className="mini-title">Send:</Text>

            <TextField.Input
              className="token-input-text"
              size="3"
              radius="none"
              placeholder="0.0"
              style={{ textAlign: 'start' }}
              value={tokenQtyInputValue}
              onChange={handleTokenQtyInputChange}
            />
            <TokenSelectorDialog />
          </Flex>
          <Flex className="balance-info">
            <Text
              size="1"
              style={{
                fontWeight: '500',
                color: '#717171'
              }}
            >
              Balance:
              {!isNaN(Number(selectedToken?.balance)) &&
              selectedToken?.balance !== undefined
                ? ` ${(
                    Number(selectedToken.balance) /
                    10 ** Number(selectedToken.decimals)
                  ).toFixed(5)} ${selectedToken?.ticker}`
                : null}
            </Text>
          </Flex>
        </Flex>
        <Flex className="address-input-box" direction="row" gap="3">
          <Text className="mini-title" style={{ paddingTop: '5px' }}>
            To:
          </Text>
          {/* <Flex className="address-input-element" justify="center"> */}
          <TextArea
            className="address-input-text"
            size="3"
            variant="soft"
            placeholder="Address or ENS (0x...)"
            value={addressInputValue}
            onChange={handleAddressInputChange}
          />
          {/* </Flex> */}

          {addressInputValue === '' || isValidAddress === false ? (
            <Tooltip content="Please enter a valid address">
              <InfoCircledIcon
                width={'30px'}
                height={'30px'}
                style={{ paddingTop: '5px' }}
              />
            </Tooltip>
          ) : (
            isValidAddress === true && (
              <CheckIcon
                color="green"
                width={'30px'}
                height={'30px'}
                style={{ paddingTop: '5px' }}
              />
            )
          )}
        </Flex>
      </Flex>
      <Text>{Number(selectedToken.balance)}</Text>
      <Text>{Number(formattedTokenQty)}</Text>
      <Text>{addressInputValue}</Text>
      {/* TODO: handle click when ETH is selected */}
      {isConnected ? (
        isValidAddress ? (
          isSufficientBalance ? (
            selectedToken.ticker !== 'ETH' ? (
              <Button
                className="button-main"
                color="green"
                size="4"
                onClick={handleERC20SendClick}
              >
                Send
              </Button>
            ) : (
              <Button
                className="button-main"
                color="blue"
                size="4"
                onClick={handleETHSendClick}
              >
                Send
              </Button>
            )
          ) : (
            <Button className="button-main" size="4" disabled>
              Insufficient Balance
            </Button>
          )
        ) : (
          <Button className="button-main" size="4" disabled>
            Enter Valid Address
          </Button>
        )
      ) : (
        <Button className="button-main" size="4" onClick={openConnectModal}>
          Connect Wallet
        </Button>
      )}
    </Flex>
  )
}

export default SendWidget
