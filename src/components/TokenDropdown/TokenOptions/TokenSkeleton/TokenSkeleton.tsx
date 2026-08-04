import React from 'react'
import cx from 'classnames'

import Bone from '../../../Bone/Bone'


type TokenSkeletonProps = {
  className?: string
}

const TokenSkeleton: React.FC<TokenSkeletonProps> = (props) => {
  const { className } = props

  return (
    <div
      className={cx(className, 'h-56 pl-16 pr-24 flex items-center')}
    >
      <div className="flex gap-12 items-center flex-1">
        <Bone
          className="rounded-full"
          w={32}
          h={32}
        />
        <div>
          <Bone
            className="rounded-4"
            textSize="sm"
            w={40}
            delay={1}
          />
          <Bone
            className="rounded-4"
            textSize="xs"
            w={65}
            delay={1}
          />
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Bone
          className="rounded-4"
          textSize="sm"
          w={56}
          delay={2}
        />
        <Bone
          className="rounded-4"
          textSize="xs"
          w={32}
          delay={2}
        />
      </div>
    </div>
  )
}


export default React.memo(TokenSkeleton)
