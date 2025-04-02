import React from 'react'
import cx from 'classnames'
import device from 'modules/device'

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
      <div className="flex-1 flex justify-center">
        <APY className="flex flex-col items-center" />
      </div>
      <div className="flex-1 flex justify-center">
        <Block
          className="flex flex-col items-center"
          value={data.tvl}
          text={isMobile ? 'TVL' : messages.tvl}
          dataTestId="stake-tvl"
        />
      </div>
    </Box>
  )
}


export default React.memo(StakeStats)
