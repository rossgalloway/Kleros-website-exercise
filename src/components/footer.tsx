import React from 'react'
import { Flex } from '@radix-ui/themes'
import { GitHubLogoIcon, UpdateIcon } from '@radix-ui/react-icons'

// TODO: Add links to github and functionality to update data

function Footer() {
  return (
    <Flex className="footer" direction="row" align="center" gap="5">
      <GitHubLogoIcon width={'20px'} height={'20px'} />

      <UpdateIcon
        width={'20px'}
        height={'20px'}
        style={{ paddingTop: '0px', color: 'black' }}
      />
    </Flex>
  )
}

export default Footer
