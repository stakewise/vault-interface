import React from 'react'
import cx from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import Icon, { IconProps } from '../Icon/Icon'
import Text, { TextProps } from '../Text/Text'


export type TextWithTooltipProps = {
  className?: string
  message: Intl.Message | string
  size?: TextProps['size']
  color?: TextProps['color']
  iconColor?: IconProps['color']
  tooltip?: Intl.Message | string
  inModal?: boolean
  dataTestId?: string
}

const TextWithTooltip: React.FC<TextWithTooltipProps> = (props) => {
  const { className, message, size, color, iconColor, tooltip, inModal, dataTestId } = props

  return (
    <div
      className={cx(className, 'flex justify-start items-center', {
        'gap-4': !className?.includes('gap-'),
      })}
      data-testid={dataTestId}
    >
      <Text
        message={message}
        size={size || 'sm'}
        color={color || 'dark'}
      />
      {
        Boolean(tooltip) && (
          <Tooltip
            content={tooltip}
            inModal={inModal}
          >
            <Icon
              className="cursor-pointer"
              color={iconColor || 'secondary'}
              size={16}
              name="icon/info"
            />
          </Tooltip>
        )
      }
    </div>
  )
}


export default React.memo(TextWithTooltip)
