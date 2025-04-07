import React from 'react'
import cx from 'classnames'
import { supportedChains, useConfig } from 'config'
import device from 'modules/device'
import { commonMessages } from 'helpers'

import { Button, Bone } from 'components'
import { openConnectWalletModal } from 'layouts/modals'

import NetworkSelect from './NetworkSelect/NetworkSelect'
import Account from './Account/Account'


type Connect = {
  className?: string
}

const networkSizes = {
  mainnet: 160,
  gnosis: 185,
  chiado: 197,
  hoodi: 178,
}

const Connect: React.FC<Connect> = ({ className }) => {
  const { address, networkId, autoConnectChecked } = useConfig()

  const { isMobile } = device.useData()

  if (!autoConnectChecked) {
    const networkWidth = networkSizes[networkId] || networkSizes.mainnet

    return (
      <div className={cx(className, 'flex gap-8')}>
        {
          supportedChains.length > 1 && (
            <Bone
              className="rounded-8"
              w={isMobile ? 44 : networkWidth}
              h={44}
            />
          )
        }
        <Bone
          className="rounded-8"
          w={isMobile ? 136 : 180}
          h={44}
        />
      </div>
    )
  }

  return (
    <div className={cx(className, 'flex')}>
      <NetworkSelect className="mr-8" />
      {
        address ? (
          <Account />
        ) : (
          <Button
            title={isMobile
              ? commonMessages.buttonTitle.connect
              : commonMessages.buttonTitle.connectWallet
            }
            dataTestId="connect-button"
            onClick={openConnectWalletModal}
          />
        )
      }
    </div>
  )
}


export default React.memo(Connect)
