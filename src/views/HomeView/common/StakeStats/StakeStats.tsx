import React from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import APY from './APY/APY'
import Box from '../Box/Box'
import Block from './Block/Block'

import messages from './messages'


type StakeStatsProps = {
  className?: string
}

const StakeStats: React.FC<StakeStatsProps> = (props) => {
  const { className } = props

  const { data } = stakeCtx.useData()
  const { isMobile } = device.useData()

  return (
    <Box className={cx(className, 'flex justify-between items-start p-12')}>
      <APY className="pr-12" />
      <Block
        className="pr-12"
        value={data.tvl}
        text={isMobile ? 'TVL' : messages.tvl}
        dataTestId="stake-tvl"
      />
      <Block
        className="pr-8"
        value={data.users.toLocaleString()}
        text={messages.stakers}
        dataTestId="stake-users"
      />
    </Box>
  )
}


export default React.memo(StakeStats)
