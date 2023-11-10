// AddressInput.tsx
import React from 'react'
import { Flex, Text, TextArea, Tooltip } from '@radix-ui/themes'
import { CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { useAccount, useNetwork } from 'wagmi'
import { useSendWidgetContext } from './sendWidgetContext'

export function AddressInputBox() {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const {
    addressInputValue,
    setAddressInputValue,
    isValidAddress,
    validAddress,
    isValidENS
  } = useSendWidgetContext()

  const handleAddressInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (isConnected) {
      setAddressInputValue(e.target.value)
    }
  }

  return (
    <Flex className="address-input-box" direction="column">
      <Flex direction="row" gap="3">
        <Text className="mini-title" style={{ paddingTop: '5px' }}>
          To:
        </Text>
        <TextArea
          className="address-input-text"
          size="3"
          variant="soft"
          placeholder="Address or ENS (0x...)"
          value={addressInputValue}
          onChange={handleAddressInputChange}
          spellCheck="false"
        />

        {addressInputValue === '' || isValidAddress === false ? (
          <Tooltip content="Please enter a valid address or ENS name">
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
      {isValidENS && isValidAddress && (
        <Text
          size="1"
          align="right"
          style={{
            fontWeight: '500',
            color: '#717171'
          }}
        >
          {chain?.id === 31337
            ? 'Hardhat Network - No address validation or ENS'
            : validAddress}
        </Text>
      )}
    </Flex>
  )
}

/**          style={{
            fontWeight: '500',
            color: '#717171'
          }} */
