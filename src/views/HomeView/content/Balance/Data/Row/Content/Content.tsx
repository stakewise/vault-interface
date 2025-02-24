import React from 'react'
import { constants } from 'helpers'

import { Text, TokenAmount, FiatAmount, Loading, UserApy } from 'components'

import { stakeCtx } from 'views/HomeView/StakeContext/util'


type TokenValue = {
  token: Tokens
  amount: bigint
}

export type ContentProps = {
  isFetching?: boolean
  value: string | TokenValue
  dataTestId?: string
  isMagicValue?: boolean
}

const Content: React.FC<ContentProps> = (props) => {
  const { value, isFetching, isMagicValue, dataTestId } = props

  const { data, unboostQueue } = stakeCtx.useData()

  if (isFetching) {
    return (
      <Loading />
    )
  }

  if (typeof value === 'object') {
    const { amount, token } = value

    return (
      <div className="text-right">
        <TokenAmount
          value={amount}
          token={token}
          size="sm"
          dataTestId={dataTestId}
        />
        <FiatAmount
          className="mt-4 opacity-60"
          amount={amount}
          token={token}
          color="moon"
          size="t12m"
        />
      </div>
    )
  }

  if (isMagicValue) {
    const userApy = data.apy.user
    const mintTokenApy = data.apy.mintToken

    let isDangerous = false,
        isUnprofitable = false

    const hasBoost = data.boost.shares > constants.blockchain.minimalAmount
    const hasUnboostQueue = Boolean(unboostQueue.position)

    if (hasBoost || hasUnboostQueue) {
      isDangerous = userApy < 0
      isUnprofitable = userApy > 0 && (mintTokenApy - userApy > 0.01)
    }

    return (
      <UserApy
        type="swap"
        userApy={data.apy.user}
        isDangerous={isDangerous}
        isUnprofitable={isUnprofitable}
        isBoosted={hasBoost || hasUnboostQueue}
        dataTestId={dataTestId}
      />
    )
  }

  return (
    <Text
      message={value}
      color="moon"
      size="t14m"
      dataTestId={dataTestId}
    />
  )
}


export default React.memo(Content)
