import React from 'react'
import { constants } from 'helpers'
import { useSelector } from 'react-redux'

import { Text, TokenAmount, FiatAmount, Loading, UserApy } from 'components'

import { stakeCtx } from 'views/HomeView/StakeContext/util'


const storeSelector = (store: Store) => ({
  boostedShares: store.vault.user.balances.boost.shares,
  unboostQueueData: store.vault.user.unboostQueue.data,
})

type TokenValue = {
  token: Tokens
  amount: bigint
}

export type ContentProps = {
  value: string | TokenValue
  dataTestId?: string
  isMagicValue?: boolean
  withMinimalValue?: boolean
}

const Content: React.FC<ContentProps> = (props) => {
  const { value, isMagicValue, withMinimalValue, dataTestId } = props

  const { data } = stakeCtx.useData()
  const { boostedShares, unboostQueueData } = useSelector(storeSelector)

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
          className="mt-4 opacity-60"
          amount={amount}
          token={token}
          color="dark"
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

    const hasBoost = boostedShares > constants.blockchain.minimalAmount
    const hasUnboostQueue = Boolean(unboostQueueData.position)

    if (hasBoost || hasUnboostQueue) {
      isDangerous = userApy < 0
      isUnprofitable = userApy > 0 && (mintTokenApy - userApy > 0.01)
    }

    return (
      <UserApy
        type="vault"
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
      color="dark"
      size="t14m"
      dataTestId={dataTestId}
    />
  )
}


export default React.memo(Content)
