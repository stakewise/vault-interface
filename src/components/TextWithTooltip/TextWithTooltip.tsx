import React from 'react'
import cx from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import Icon, { IconProps } from '../Icon/Icon'
import Text, { TextProps } from '../Text/Text'


export type TextWithTooltipProps = {
  className?: string
  text: {
    className?: string
    message: Intl.Message | string
    color?: TextProps['color']
    size?: TextProps['size']
    dataTestId?: string
  }
  icon?: {
    size: IconProps['size']
    color: IconProps['color']
  }
  tooltip?: Intl.Message | string
}

const TextWithTooltip: React.FC<TextWithTooltipProps> = (props) => {
  const { className, text, icon, tooltip } = props

  return (
    <div className={cx(className, 'flex justify-start items-center')}>
      <Text
        className={text.className}
        dataTestId={text.dataTestId}
        message={text.message}
        size={text.size || 't14m'}
        color={text.color || 'moon'}
      />
      {
        Boolean(tooltip) && (
          <Tooltip content={tooltip}>
            <Icon
              className="ml-4 opacity-50"
              color={icon?.color || 'stone'}
              size={icon?.size || 16}
              name="icon/info"
            />
          </Tooltip>
        )
      }
    </div>
  )
}


export default React.memo(TextWithTooltip)
