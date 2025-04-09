import React from 'react'
import cx from 'classnames'
import methods from 'helpers/methods'
import { useConfig } from 'config'
import device from 'modules/device'

import { Text, Icon } from 'components'
import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { ApyBreakdown } from 'views/HomeView/common'

import MagicPercent from './MagicPercent/MagicPercent'

import messages from './messages'


type APYProps = {
  className?: string
}

const APY: React.FC<APYProps> = (props) => {
  const { className } = props

  const { isEthereum } = useConfig()
  const { data } = stakeCtx.useData()
  const { isMobile } = device.useData()

  const isProfitable = data.apy.mintToken < data.apy.maxBoost

  return (
    <div className={className}>
      <div className="flex items-center justify-start">
        <Text
          className="opacity-60"
          message={methods.formatApy(data.apy.vault)}
          color="dark"
          size="t14"
          dataTestId="vault-apy"
        />
        {
          (isEthereum && isProfitable) && (
            <>
              &nbsp;
              <Text
                className="opacity-60"
                message="-"
                color="dark"
                size="t14"
              />
              &nbsp;
              <MagicPercent
                value={methods.formatApy(data.apy.maxBoost)}
                dataTestId="max-boost-apy"
                iconPosition="right"
              />
            </>
          )
        }
      </div>
      <div
        className={cx('flex items-center gap-4', { 'mt-4': isMobile })}
      >
        <Text
          className="opacity-40"
          message={messages.apy}
          color="dark"
          size={isMobile ? 't12m' : 't14m'}
        />
        <ApyBreakdown
          withText={isEthereum && isProfitable}
        >
          <Icon
            className="opacity-20"
            name="icon/info"
            color="dark"
            size={16}
          />
        </ApyBreakdown>
      </div>
    </div>
  )
}


export default React.memo(APY)
