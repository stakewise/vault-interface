import React from 'react'
import device from 'modules/device'

import { Chart } from 'components'

import Mobile from '../Mobile/Mobile'
import Desktop from '../Desktop/Desktop'
import { useForm, useOptions, Tab } from '../util'
import type { ChartWithFilterProps } from '../ChartWithFilter'


type SkeletonProps = {
  className?: string
}

const fetcherMock: ChartWithFilterProps['tabsItems'][0]['fetcher'] = () => Promise.resolve({
  apy: [],
  rewards: [],
  balance: [],
})

const tabsItems: ChartWithFilterProps['tabsItems'] =[
  {
    tab: Tab.User,
    fetcher: fetcherMock,
  },
  {
    tab: Tab.Vault,
    fetcher: fetcherMock,
  },
]

const Skeleton: React.FC<SkeletonProps> = (props) => {
  const { className } = props

  const { isMobile } = device.useData()
  const options = useOptions(tabsItems)
  const { form } = useForm(options)

  const View = isMobile ? Mobile : Desktop

  return (
    <View
      className={className}
      vaultAddress="0x"
      options={options}
      form={form}
      isFetching
    >
      <Chart
        data={[]}
        hideRightScale={isMobile}
        pointType="percent"
        token="ETH"
        style="bar"
        isFetching
      />
    </View>
  )
}


export default React.memo(Skeleton)
