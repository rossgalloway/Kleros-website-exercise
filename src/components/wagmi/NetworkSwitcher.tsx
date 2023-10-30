import { useNetwork, useSwitchNetwork } from 'wagmi'
import { Button, Box } from '@radix-ui/themes'

export function NetworkSwitcher() {
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  return (
    <Box>
      <div>
        Connected to {chain?.name ?? chain?.id}
        {chain?.unsupported && ' (unsupported)'}
      </div>
      <br />
      {switchNetwork && (
        <div>
          Switch to:{' '}
          {chains.map((x) =>
            x.id === chain?.id ? null : (
              <Button key={x.id} onClick={() => switchNetwork(x.id)}>
                {x.name}
                {isLoading && x.id === pendingChainId && ' (switching)'}
              </Button>
            )
          )}
        </div>
      )}

      <div>{error?.message}</div>
    </Box>
  )
}
