import React, { useCallback } from 'react'
import { commonMessages } from 'helpers'
import { useCopyToClipboard } from 'hooks'
import { useConfig } from 'config'
import methods from 'helpers/methods'
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
  }, [ address, copyToClipboard ])

  const handleCLickToLink = useCallback(() => {
    window.open(`${scanLink}${address}`, '_blank')
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
          color="dark"
          size="t14m"
        />
      </div>
      <div className="flex justify-end items-center">
        <RoundButton
          ariaLabel={commonMessages.accessibility.copyButton}
          icon="icon/copy"
          color="secondary"
          size={24}
          onClick={handleCopy}
        />
        <RoundButton
          className="ml-8"
          ariaLabel={commonMessages.accessibility.viewInBlockExplorer}
          icon="icon/link"
          color="secondary"
          size={24}
          onClick={handleCLickToLink}
        />
      </div>
    </div>
  )
}


export default React.memo(Address)
