import React, { ReactNode } from 'react'

import PopupInfo from '../PopupInfo/PopupInfo'

import Details, { DetailsProps } from './Details/Details'


export type ApyBreakdownProps = {
  className?: string
  data?: DetailsProps['data']
  withText?: boolean
  maxBoostApy: number
  children: ReactNode
}

const ApyBreakdown: React.FC<ApyBreakdownProps> = (props) => {
  const { className, children, data, withText, maxBoostApy } = props

  return (
    <PopupInfo
      className={className}
      headNode={children}
      buttonClassName="line-height-0"
    >
      <Details
        data={data || []}
        withText={withText}
        maxBoostApy={maxBoostApy}
      />
    </PopupInfo>
  )
}


export default React.memo(ApyBreakdown)
