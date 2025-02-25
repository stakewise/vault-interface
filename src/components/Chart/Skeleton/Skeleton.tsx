import React from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'

import Bone from '../../Bone/Bone'


type SkeletonProps = {
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  const { isMobile } = device.useData()
  const columns = isMobile ? 4 : 6

  return (
    <div className={className}>
      <div className="absolute top-0 right-0 pb-32 h-full">
        <Bone className="top-0 right-0 mr-48 h-full w-px bg-moon/03" />
      </div>
      <div className="absolute w-full pr-48 bottom-0">
        <Bone className="top-0 right-0 mb-32 w-full h-px bg-moon/03" />
      </div>
      {
        Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className="absolute bottom-0 mb-48"
            style={{
              height: `${50 + index * 30}rem`,
              left: `${(index / columns) * 100}%`,
            }}
          >
            <Bone
              className={cx('top-0 right-0 ml-8 h-full', {
                'w-24': isMobile,
                'w-60': !isMobile,
              })}
            />
          </div>
        ))
      }
      <div className="absolute top-0 right-0 pb-32 h-full">
        <Bone className="top-0 right-0 ml-8 h-full w-32" />
      </div>
      <div className="absolute w-full bottom-0">
        <Bone className="w-full h-20" />
      </div>
      <div className="absolute top-0 left-0 w-full">
        <Bone className="w-[140rem] h-24" />
        <Bone className="mt-12 w-80 h-20" />
      </div>
    </div>
  )
}


export default React.memo(Skeleton)
