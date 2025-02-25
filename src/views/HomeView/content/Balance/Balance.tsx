import React from 'react'

import { Box } from 'views/HomeView/common'

import Data from './Data/Data'
import useOpen from './util/useOpen'
import UnboostQueue from './UnboostQueue/UnboostQueue'
import UnstakeQueue from './UnstakeQueue/UnstakeQueue'
import StatisticsButton from './StatisticsButton/StatisticsButton'


const Balance: React.FC = () => {
  const { exitQueue, unboostQueue } = useOpen()

  return (
    <>
      <Box className="mt-8 p-24">
        <Data />
        <StatisticsButton className="mt-8" />
      </Box>
      <UnboostQueue
        className="mt-24"
        isOpen={unboostQueue.isOpen}
        handleOpen={unboostQueue.handleOpen}
      />
      <UnstakeQueue
        className="mt-24"
        isOpen={exitQueue.isOpen}
        handleOpen={exitQueue.handleOpen}
      />
    </>
  )
}


export default React.memo(Balance)
