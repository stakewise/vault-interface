import React from 'react'
import cx from 'classnames'

import { Text, Tooltip, Icon, IconName } from 'components'

import Value, { ValueProps } from './Value/Value'
import Content, { ContentProps } from './Content/Content'


export type OptionProps = ValueProps & {
  className?: string
  tooltip?: Intl.Message | string
  title: Intl.Message | string
}

const Option: React.FC<OptionProps> = (props) => {
  const { className, title, tooltip, textValue, tokenValue, singleValue, isFetching, isMagicValue } = props

  return (
    <div className={cx(className, 'flex justify-between items-center')}>
      <div className="flex justify-start items-center">
        <Text
          className="opacity-50"
          message={title}
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
      <Value
        textValue={textValue}
        tokenValue={tokenValue}
        singleValue={singleValue}
        isFetching={isFetching}
      />
      {/*<Content*/}
      {/*  icon={icon}*/}
      {/*  value={value}*/}
      {/*  textValue={textValue}*/}
      {/*  isFetching={isFetching}*/}
      {/*  isMagicValue={isMagicValue}*/}
      {/*  dataTestId={dataTestId}*/}
      {/*/>*/}
    </div>
  )
}


export default React.memo(Option)
