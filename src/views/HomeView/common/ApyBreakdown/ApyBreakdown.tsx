import React, { ReactNode } from 'react'
import { useStore } from 'hooks'

import { PopupInfo } from 'components'

import Details from './Details/Details'

import { useApyDetails } from './util'


const storeSelector = (store: Store) => ({
  apy: store.vault.base.data.apy,
  isMoreV2: store.vault.base.data.versions.isMoreV2,
  maxBoostApy: store.vault.base.data.allocatorMaxBoostApy,
})

type ApyBreakdownProps = {
  children: ReactNode
  withText?: boolean
}

const ApyBreakdown: React.FC<ApyBreakdownProps> = (props) => {
  const { children, withText } = props

  const { data } = useApyDetails()
  const { apy, isMoreV2, maxBoostApy } = useStore(storeSelector)

  const isBoostProfitable = maxBoostApy > apy && isMoreV2
  const isPopupEnabled = isBoostProfitable && withText || Boolean(data.length)

  if (isPopupEnabled) {
    return (
      <PopupInfo
        headNode={children}
      >
        <Details
          data={data}
          withText={withText}
        />
      </PopupInfo>
    )
  }

  return null
}


export default React.memo(ApyBreakdown)
