import React from 'react'
import cx from 'classnames'
import { useStore } from 'hooks'
import { methods } from 'helpers'
import { useConfig } from 'config'
import device from 'modules/device'

import { Text, Icon, ApyBreakdown } from 'components'

import MagicPercent from '../../MagicPercent/MagicPercent'

import messages from './messages'


type APYProps = {
  className?: string
}

const storeSelector = (store: Store) => ({
  apy: store.vault.base.data.apy,
  maxBoostApy: store.vault.base.data.allocatorMaxBoostApy,
})

const APY: React.FC<APYProps> = (props) => {
  const { className } = props

  const { isEthereum } = useConfig()
  const { isDesktop } = device.useData()
  const { apy, maxBoostApy } = useStore(storeSelector)

  const isProfitable = apy < maxBoostApy
  const isBoostEnabled = isEthereum && isProfitable

  return (
    <div className={className}>
      <div className="flex items-center justify-start">
        <Text
          className="opacity-60"
          message={methods.formatApy(apy)}
          color="dark"
          size="sm"
          dataTestId="vault-apy"
        />
        {
          isBoostEnabled && (
            <>
              &nbsp;
              <Text
                className="opacity-60"
                message="-"
                color="dark"
                size="sm"
              />
              &nbsp;
              <MagicPercent
                value={methods.formatApy(maxBoostApy)}
                dataTestId="max-boost-apy"
                iconPosition="right"
              />
            </>
          )
        }
      </div>
      <div
        className={cx('flex items-center gap-4', { 'mt-4': !isDesktop })}
      >
        <Text
          className="opacity-40"
          message={!isDesktop ? 'APY' : messages.apy}
          color="dark"
          size={!isDesktop ? 't12m' : 't14m'}
        />
        {
          isBoostEnabled && (
            <ApyBreakdown
              maxBoostApy={maxBoostApy}
              withText
            >
              <Icon
                className="opacity-20"
                name="icon/info"
                color="dark"
                size={16}
              />
            </ApyBreakdown>
          )
        }
      </div>
    </div>
  )
}


export default React.memo(APY)
