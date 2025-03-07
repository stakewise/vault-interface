import React from 'react'
import cx from 'classnames'

import Icon from '../../Icon/Icon'
import Text from '../../Text/Text'
import Logo from '../../Logo/Logo'


export type LegendProps = {
  className?: string
  token: Tokens
  pointType: Charts.PointType
  fiatTooltipRef: React.RefObject<HTMLDivElement>
  timeTooltipRef: React.RefObject<HTMLDivElement>
  percentageTooltipRef: React.RefObject<HTMLDivElement>
  tokenValueTooltipRef: React.RefObject<HTMLDivElement>
}

const Legend: React.FC<LegendProps> = (props) => {
  const {
    token,
    pointType,
    fiatTooltipRef,
    timeTooltipRef,
    percentageTooltipRef,
    tokenValueTooltipRef,
  } = props

  return (
    <div className="absolute top-0 left-0 z-1">
      {
        pointType === 'fiat' ? (
          <div className="flex items-center gap-4">
            <Logo name={`token/${token}`} />
            <Text
              ref={tokenValueTooltipRef}
              message=""
              size="t18m"
              color="dark"
            />
            <Text
              ref={fiatTooltipRef}
              className="opacity-50"
              message=""
              color="dark"
              size="t14m"
            />
          </div>
        ) : (
          <Text
            ref={percentageTooltipRef}
            className="opacity-80"
            message=""
            color="dark"
            size="t18m"
          />
        )
      }
      <div className="flex items-center gap-4 mt-8">
        <Icon
          className={cx('opacity-40', {
            'ml-4': pointType === 'fiat',
          })}
          name="icon/calendar"
          color="dark"
        />
        <Text
          ref={timeTooltipRef}
          className="opacity-50"
          message=""
          color="dark"
          size="t12m"
        />
      </div>
    </div>
  )
}


export default React.memo(Legend)
