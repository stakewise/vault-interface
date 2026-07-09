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
  const { className, text, value, values, tooltip, icon, logo, isFetching, isMagicValue, dataTestId } = props

  return (
    <div className={cx(className, 'flex justify-between items-center')}>
      <div className="flex justify-start items-center">
        <Text
          className="opacity-50 font-medium"
          message={text}
          color="dark"
          size="sm"
        />
        {
          Boolean(tooltip) && (
            <Tooltip
              content={tooltip}
              wrapperClassName="flex"
            >
              <Icon
                className="ml-4 opacity-20"
                name="icon/info"
                color="dark"
                size={16}
              />
            </Tooltip>
          )
        }
      </div>
      <Content
        icon={icon}
        logo={logo}
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
