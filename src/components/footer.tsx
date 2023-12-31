import React, { useState } from 'react'
import { Flex, Tooltip } from '@radix-ui/themes'
import { GitHubLogoIcon, UpdateIcon } from '@radix-ui/react-icons'
import { useDappContext } from '../contexts/dAppContext'

function Footer() {
  const [isSpinning, setIsSpinning] = useState(false)
  const { setShouldFetchBalances, setShouldFetchTokens } = useDappContext()

  const handleRefresh = () => {
    setIsSpinning(true)
    setShouldFetchBalances(false)
    setShouldFetchTokens(false)
    setTimeout(() => setShouldFetchTokens(true), 500)
    setTimeout(() => setShouldFetchBalances(true), 1000)
    setTimeout(() => setIsSpinning(false), 1000)
  }

  return (
    <Flex className="footer" direction="row" align="center" gap="5">
      <button
        className="footer-button"
        onClick={() =>
          window.open(
            'https://github.com/rossgalloway/Kleros-website-exercise',
            '_blank'
          )
        }
      >
        <GitHubLogoIcon className="footer-icon" />
      </button>
      <Tooltip content="click to refresh data">
        <button className="footer-button" onClick={handleRefresh}>
          <UpdateIcon className={`footer-icon ${isSpinning ? 'spin' : ''}`} />
        </button>
      </Tooltip>
    </Flex>
  )
}

export default Footer
