import React, { useCallback } from 'react'
import { getConfig, supportedChains, useConfig } from 'config'
import { commonMessages } from 'helpers'
import device from 'sw-modules/device'
import { chains } from 'sdk'

import { Button, Dropdown, DropdownProps } from 'components'

import useChangeChainDisabled from './util/useChangeChainDisabled'


type NetworkSelectProps = {
  className?: string
  disabled?: boolean
}

const networkOptions = Object.values(supportedChains)
  .sort((config) => config.isTestnet ? 1 : -1)
  .reduce((acc, config) => {
    if (IS_PROD && config.isTestnet) {
      return acc
    }

    const isGnosis = (
      config.id === chains.gnosis.id
      || config.id === chains.chiado.id
    )

    const logo = isGnosis ? 'token/GNO' : 'token/ETH'

    const item: SelectProps['options'][number] = {
      title: config.name,
      value: config.id,
      logo,
    }

    return [ ...acc, item ]
  }, [] as DropdownProps['options'])

const dataTestId = 'network-select'

const NetworkSelect: React.FC<NetworkSelectProps> = (props) => {
  const { className } = props

  const { isMobile } = device.useData()
  const isChangeChainDisabled = useChangeChainDisabled()
  const { sdk, networkId, wallet, isGnosis } = useConfig()

  const handleChangeChain = useCallback(async (selectedNetworkId: string) => {
    if (selectedNetworkId !== networkId) {
      const selectedConfig = getConfig(selectedNetworkId as NetworkIds)

      if (selectedConfig) {
        wallet.changeChain(selectedConfig.network.id)
      }
    }
  }, [ networkId, wallet ])

  return (
    <Dropdown
      className={className}
      dataTestId={dataTestId}
      placement="bottom-start"
      disabled={isChangeChainDisabled}
      button={(
        <Button
          className="rounded-8"
          color="crystal"
          dataTestId={`${dataTestId}-button`}
          logo={isGnosis ? 'token/GNO' : 'token/ETH'}
          title={isMobile ? '' : sdk.config.network.name}
          ariaLabel={commonMessages.accessibility.changeNetwork}
        />
      )}
      value={networkId}
      withArrow={!isMobile}
      options={networkOptions}
      onChange={handleChangeChain}
    />
  )
}


export default React.memo(NetworkSelect)
