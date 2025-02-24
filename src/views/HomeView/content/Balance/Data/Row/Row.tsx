import React from 'react'
import cx from 'classnames'

import { TextWithTooltip } from 'components'

import Content from './Content/Content'


type Value = {
  token: Tokens
  amount: bigint
}

export type RowProps = {
  className?: string
  isFetching?: boolean
  tooltip?: Intl.Message
  text: Intl.Message | string
  value: string | Value
  dataTestId?: string
  isMagicValue?: boolean
}

const Row: React.FC<RowProps> = (props) => {
  const { className, text, value, tooltip, isFetching, isMagicValue, dataTestId } = props

  return (
    <div className={cx(className, 'flex justify-between items-center')}>
      <div>
        <TextWithTooltip
          text={{
            message: text,
            color: 'moon',
            size: 't14m',
          }}
          tooltip={tooltip}
        />
      </div>
      <div className="flex justify-end items-center">
        <Content
          value={value}
          isFetching={isFetching}
          dataTestId={dataTestId}
          isMagicValue={isMagicValue}
        />
      </div>
    </div>
  )
}


export default React.memo(Row)
