import React from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'

import { Text } from 'components'


type BlockProps = {
  className?: string
  text: Intl.Message | string
  dataTestId?: string
  value: string
}

const Block: React.FC<BlockProps> = (props) => {
  const { className, value, text, dataTestId } = props

  const { isMobile } = device.useData()

  return (
    <div className={className}>
      <Text
        className="opacity-60"
        message={value}
        color="moon"
        size="t14"
        dataTestId={dataTestId}
      />
      <Text
        className={cx('opacity-40', { 'mt-4': isMobile })}
        message={text}
        color="moon"
        size={isMobile ? 't12m' : 't14m'}
      />
    </div>
  )
}


export default React.memo(Block)
