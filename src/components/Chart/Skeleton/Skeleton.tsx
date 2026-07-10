import React from 'react'
import device from 'modules/device'

import Bone from '../../Bone/Bone'


type SkeletonProps = {
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  const { isDesktop } = device.useData()
  const columns = !isDesktop ? 4 : 6

  return (
    <div className={className}>
      <div className="absolute top-4 right-4 pb-32 h-full">
        <Bone className="mr-48 h-full w-px bg-moon/3" />
      </div>
      <div className="absolute w-full pr-48 bottom-4">
        <Bone className="mb-32 w-full h-px bg-moon/3" />
      </div>
      <div>
        {
          Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className="absolute bottom-4 mb-48"
              style={{
                height: `${50 + index * 30}px`,
                left: `${Math.max(((index / columns) * 95), 4)}%`,
                width: `${50 / columns}%`,
              }}
            >
              <Bone className="h-full" />
            </div>
          ))
        }
      </div>
      <div className="absolute top-4 right-4 pb-32 h-full">
        <Bone className="ml-8 h-full w-16" />
      </div>
      <div className="absolute w-full bottom-4">
        <Bone className="w-full h-20" />
      </div>
      <div className="absolute top-4 left-4 w-full">
        <Bone className="w-[140px] h-24" />
        <Bone className="mt-12 w-80 h-16" />
      </div>
    </div>
  )
}


export default React.memo(Skeleton)
