import React, { useMemo } from 'react'
import device from 'sw-modules/device'

import { Bone } from 'components'


type SkeletonProps = {
  className?: string
  count: number
}

const Skeleton: React.FC<SkeletonProps> = ({ className, count }) => {
  const { isMobile } = device.useData()

  const initialList = useMemo(() => (
    new Array(count).fill('')
  ),[ count ])

  return (
    <div className={className}>
      {
        initialList.map((_, index) => {
          if (index % 2) {
            return (
              <Bone
                key={index}
                delay={1}
                h={isMobile ? 76 : 52}
                wFull
              />
            )
          }

          return (
            <div
              key={index}
              style={{
                height: isMobile ? '76rem' : '52rem',
              }}
            />
          )
        })
      }
    </div>
  )
}


export default React.memo(Skeleton)
