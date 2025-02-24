import React from 'react'

import { Bone } from 'components'


type FiltersSkeletonProps = {
  className?: string
}

const FiltersSkeleton: React.FC<FiltersSkeletonProps> = (props) => {
  const { className } = props

  return (
    <div className={className}>
      <Bone
        className="rounded-12"
        w={165}
        h={30}
        delay={1}
      />
      <Bone
        w={65}
        h={30}
        delay={1}
      />
    </div>
  )
}


export default React.memo(FiltersSkeleton)
