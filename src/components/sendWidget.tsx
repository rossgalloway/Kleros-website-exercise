import { Button, Flex, Text, TextField } from '@radix-ui/themes'
import TokenSelectorDialog from './TokenSelectorDialog'

export function SendWidget() {
  //content
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
        <Flex className="token-input" direction="column" gap="3">
          <Text className="input-element" size="3" color="crimson">
            Send:
          </Text>
          <Flex className="input-element" justify="between">
            <TokenSelectorDialog />
            <TextField.Root>
              <TextField.Input placeholder="0.0" />
            </TextField.Root>
          </Flex>
          <Flex className="input-element" justify="end">
            <Text size="1" color="gray" align="right">
              Balance: #
            </Text>
          </Flex>
        </Flex>
        <Flex className="address-input" direction="column" gap="3">
          <Text className="input-element" size="3" color="crimson">
            To:
          </Text>
          <Flex className="input-element" justify="between">
            <TextField.Root>
              <TextField.Input placeholder="Address or ENS (0x...)" />
            </TextField.Root>
          </Flex>
        </Flex>
      </Flex>
      <Button className="button-main" size="4">
        Send
      </Button>
    </Flex>
  )
}

export default SendWidget
