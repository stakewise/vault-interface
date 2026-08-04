import React from 'react'
import { useStore } from 'hooks'
import { constants } from 'helpers'

import { Text, TokenAmount, FiatAmount, UserApy, Loading } from 'components'


type TokenValue = {
  token: Tokens
  amount: bigint
}

export type ContentProps = {
  isFetching?: boolean
  dataTestId?: string
  isMagicValue?: boolean
  value: string | TokenValue
  withMinimalValue?: boolean
}

const storeSelector = (store: Store) => ({
  apy: store.vault.base.data.apy,
  userApy: store.vault.user.balances.userAPY,
  boostedShares: store.vault.user.balances.boost.shares,
  unboostQueuePosition: store.vault.user.unboostQueue.data.position,
})

const Content: React.FC<ContentProps> = (props) => {
  const { value, isFetching, isMagicValue, withMinimalValue, dataTestId } = props

  const {
    apy,
    userApy,
    boostedShares,
    unboostQueuePosition,
  } = useStore(storeSelector)

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
          withMinimalValue={withMinimalValue}
        />
        <FiatAmount
          className="mt-4 opacity-60 font-medium"
          amount={amount}
          token={token}
          color="dark"
          size="xs"
        />
      </div>
    )
  }

  if (isMagicValue) {
    let isDangerous = false,
      isUnprofitable = false

    const hasBoost = boostedShares > constants.blockchain.minimalAmount
    const hasUnboostQueue = Boolean(unboostQueuePosition)

    if (hasBoost || hasUnboostQueue) {
      isDangerous = userApy < 0
      isUnprofitable = userApy > 0 && (apy - userApy > 0.01)
    }

    return (
      <UserApy
        type="vault"
        userApy={userApy}
        isDangerous={isDangerous}
        isUnprofitable={isUnprofitable}
        isBoosted={hasBoost || hasUnboostQueue}
        dataTestId={dataTestId}
      />
    )
  }

  return (
    <Text
      className="font-medium"
      message={value}
      color="dark"
      size="sm"
      dataTestId={dataTestId}
    />
  )
}


export default React.memo(Content)
