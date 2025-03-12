import React from 'react'
import cx from 'classnames'

import Time from './Time/Time'
import Text from '../../Text/Text'
import Amount from './Amount/Amount'
import Percentage from './Percentage/Percentage'

import s from './Legend.module.scss'


export type LegendProps = {
  className?: string
  token: Tokens
  chart: Charts.Chart
  dataArr: Charts.DataArr
  pointType: Charts.PointType
}

const Legend: React.FC<LegendProps> = (props) => {
  const { className, token, chart, pointType, dataArr } = props

  const isPercent = pointType === 'percent'

  return (
    <div className={cx(className, 'pointer-events-none')}>
      {
        dataArr.map(({ series, options } , index) => (
          <div className={cx({ 'mt-4': index }, 'flex items-center justify-start')} key={index}>
            {
              Boolean(options?.legendLine) && (
                <div
                  className={cx(s.line, 'mr-8 w-32')}
                  style={{ backgroundColor: options?.legendLine }}
                />
              )
            }
            {
              isPercent ? (
                <Percentage
                  chart={chart}
                  series={series}
                />
              ) : (
                <Amount
                  chart={chart}
                  token={token}
                  series={series}
                />
              )
            }
            {
              Boolean(options?.legendTitle) && (
                <Text
                  className={cx('opacity-50', {
                    'ml-8': !isPercent,
                  })}
                  message={options?.legendTitle || ''}
                  color="dark"
                  size="t14m"
                />
              )
            }
          </div>
        ))
      }
      <Time
        chart={chart}
        series={dataArr[0].series as Charts.Series}
        pointType={pointType}
      />
    </div>
  )
}


export default React.memo(Legend)
