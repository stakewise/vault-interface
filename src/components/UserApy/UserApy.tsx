import React from 'react'
import methods from 'sw-methods'

import Text from '../Text/Text'
import Loading from '../Loading/Loading'

import BoostPercent, { BoostPercentProps } from './BoostPercent/BoostPercent'


export type UserApyProps = BoostPercentProps & {
  isFetching?: boolean
  isBoosted: boolean
}

const UserApy: React.FC<UserApyProps> = (props) => {
  const {
    type,
    userApy,
    isBoosted,
    isFetching,
    isDangerous,
    isUnprofitable,
    dataTestId,
  } = props

  if (!isBoosted) {
    return (
      <Text
        message={methods.formatApy(userApy)}
        dataTestId={dataTestId}
        color="dark"
        size="t14m"
      />
    )
  }

  if (isFetching) {
    return (
      <Loading size={16} />
    )
  }

  return (
    <BoostPercent
      type={type}
      userApy={userApy}
      dataTestId={dataTestId}
      isDangerous={isDangerous}
      isUnprofitable={isUnprofitable}
    />
  )
}


export default React.memo(UserApy)
