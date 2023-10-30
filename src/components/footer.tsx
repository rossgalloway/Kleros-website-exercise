import { Flex } from '@radix-ui/themes'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

function Footer() {
  return (
    <Flex className="footer" direction="row" align="center">
      <GitHubLogoIcon />
    </Flex>
  )
}

export default Footer
