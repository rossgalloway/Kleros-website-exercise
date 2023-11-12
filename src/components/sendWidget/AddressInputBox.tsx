// AddressInput.tsx
import React, { useEffect } from 'react'
import { Flex, Text, TextArea, Tooltip } from '@radix-ui/themes'
import { CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { useAccount, useNetwork } from 'wagmi'
import { useSendWidgetContext } from '../../contexts/sendWidgetContext'
import {
  useValidateAddress,
  useCheckEnsAddress
} from '../../hooks/sendWidgetHooks'

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
  useValidateAddress()
  useCheckEnsAddress()

  const handleAddressInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAddressInputValue(e.target.value)
  }

  useEffect(() => {
    setAddressInputValue('')
  }, [isConnected, setAddressInputValue])

  return (
    <Flex className="address-input-box" direction="column">
      <Flex direction="row">
        <Text className="mini-title">To:</Text>
        <TextArea
          className="address-input-text"
          size="3"
          variant="soft"
          placeholder="Address or ENS (0x...)"
          value={addressInputValue}
          onChange={handleAddressInputChange}
          spellCheck="false"
          disabled={!isConnected}
        />
        <div className="validation-container">
          {addressInputValue === '' || isValidAddress === false ? (
            <Tooltip content="Please enter a valid address or ENS name">
              <InfoCircledIcon width={'15px'} height={'15px'} />
            </Tooltip>
          ) : (
            isValidAddress && (
              <CheckIcon color="green" width={'25px'} height={'25px'} />
            )
          )}
        </div>
      </Flex>
      <div className="ens-address">
        {isValidENS && isValidAddress && (
          <Text size="1" align="right" className="info-text">
            {chain?.id === 31337
              ? 'Hardhat Network - No address validation or ENS'
              : validAddress}
          </Text>
        )}
      </div>
    </Flex>
  )
}
