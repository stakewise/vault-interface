import React from 'react'
import cx from 'classnames'

import { Text, Tooltip, Icon } from 'components'

import Content, { ContentProps } from './Content/Content'


export type OptionProps = ContentProps & {
  className?: string
  tooltip?: Intl.Message | string
  text: Intl.Message | string
  dataTestId?: string
}

const Option: React.FC<OptionProps> = (props) => {
  const { className, text, value, values, tooltip, icon, isFetching, isMagicValue, dataTestId } = props

  return (
    <div className={cx(className, 'flex justify-between items-center')}>
      <div className="flex justify-start items-center">
        <Text
          className="opacity-50"
          message={text}
          color="moon"
          size="t14m"
        />
        {
          Boolean(tooltip) && (
            <Tooltip content={tooltip}>
              <Icon
                className="ml-4 opacity-20"
                name="icon/info"
                color="moon"
                size={16}
              />
            </Tooltip>
          )
        }
      </div>
      <Content
        icon={icon}
        value={value}
        values={values}
        isFetching={isFetching}
        isMagicValue={isMagicValue}
        dataTestId={dataTestId}
      />
    </div>
  )
}


export default React.memo(Option)
