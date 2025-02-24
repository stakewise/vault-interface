import React from 'react'
import { commonMessages } from 'helpers'

import { Button } from 'components'
import { openStatisticsModal } from 'views/HomeView/modals'


type StatisticsButtonProps = {
  className?: string
}

const StatisticsButton: React.FC<StatisticsButtonProps> = (props) => {
  const { className } = props

  return (
    <Button
      className={className}
      fullWidth
      color="fancy-ocean"
      title={commonMessages.statistics}
      dataTestId="statistics-button"
      onClick={openStatisticsModal}
    />
  )
}


export default React.memo(StatisticsButton)
