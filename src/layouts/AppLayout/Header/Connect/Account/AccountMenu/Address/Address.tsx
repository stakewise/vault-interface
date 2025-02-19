import React, { useCallback } from 'react'
import { analytics, commonMessages } from 'helpers'
import { useCopyToClipboard } from 'hooks'
import { useConfig } from 'config'
import methods from 'sw-methods'
import cx from 'classnames'

import { Text, Logo, RoundButton } from 'components'
import type { LogoName } from 'components'


type AddressProps = {
  className?: string
  logo: LogoName
}

const Address: React.FC<AddressProps> = (props) => {
  const { className, logo } = props

  const { sdk, address } = useConfig()

  const copyToClipboard = useCopyToClipboard()
  const scanLink = `${sdk.config.network.blockExplorerUrl}/address/`
  const shortAddress = methods.shortenAddress(address)

  const handleCopy = useCallback(() => {
    copyToClipboard(address as string)
    analytics.statistics.sendEvent('copyWalletAddress')
  }, [ address, copyToClipboard ])

  const handleCLickToLink = useCallback(() => {
    window.open(`${scanLink}${address}`, '_blank')
    analytics.statistics.sendEvent('clickWalletEtherscan')
  }, [ address, scanLink ])

  return (
    <div className={cx(className, 'flex justify-center items-center')}>
      <div className="mr-24 flex justify-start items-center">
        <Logo
          name={logo as LogoName}
          size={16}
        />
        <Text
          className="ml-8"
          message={shortAddress}
          color="moon"
          size="t14m"
        />
      </div>
      <div className="flex justify-end items-center">
        <RoundButton
          ariaLabel={commonMessages.accessibility.copyButton}
          icon="icon/copy"
          color="stone"
          size={24}
          onClick={handleCopy}
        />
        <RoundButton
          className="ml-8"
          ariaLabel={commonMessages.accessibility.viewInBlockExplorer}
          icon="icon/link"
          color="stone"
          size={24}
          onClick={handleCLickToLink}
        />
      </div>
    </div>
  )
}


export default React.memo(Address)
