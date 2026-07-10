import React from 'react'
import cx from 'classnames'

import { Text, MagicIcon } from 'components'


type MagicPercentProps = {
  className?: string
  dataTestId?: string
  value: string | number
  iconPosition?: 'left' | 'right'
}

const MagicPercent: React.FC<MagicPercentProps> = (props) => {
  const { className, value, dataTestId, iconPosition = 'left' } = props

  return (
    <div className={cx(className, 'flex justify-start items-center gap-4')}>
      {
        iconPosition === 'left' && (
          <MagicIcon />
        )
      }
      <Text
        className="text-primary font-bold"
        message={String(value)}
        color="inherit"
        size="sm"
        dataTestId={dataTestId}
      />
      {
        iconPosition === 'right' && (
          <MagicIcon />
        )
      }
    </div>
  )
}


export default React.memo(MagicPercent)
