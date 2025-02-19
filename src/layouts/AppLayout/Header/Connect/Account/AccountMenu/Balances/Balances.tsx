import React, { useMemo } from 'react'
import cx from 'classnames'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { constants } from 'helpers'

import Balance from './Balance/Balance'


type BalancesProps = {
  className?: string
}

const storeSelector = (store: Store) => ({
  mintTokenBalance: store.account.balances.data.mintTokenBalance,
  swiseTokenBalance: store.account.balances.data.swiseTokenBalance,
  nativeTokenBalance: store.account.balances.data.nativeTokenBalance,
  depositTokenBalance: store.account.balances.data.depositTokenBalance,
  isFetching: store.account.balances.isFetching,
})

const Balances: React.FC<BalancesProps> = (props) => {
  const { className } = props

  const { sdk } = useConfig()

  const isStakeNativeToken = sdk.config.tokens.depositToken === sdk.config.tokens.nativeToken

  const {
    depositTokenBalance,
    nativeTokenBalance,
    swiseTokenBalance,
    mintTokenBalance,
    isFetching,
  } = useStore(storeSelector)

  const balances = useMemo(() => {
    const nativeBalance = {
      token: sdk.config.tokens.nativeToken,
      value: nativeTokenBalance,
    }

    const commonBalances = [
      {
        token: sdk.config.tokens.mintToken,
        value: mintTokenBalance,
      },
      {
        token: constants.tokens.swise,
        value: swiseTokenBalance,
      },
    ]

    if (!isStakeNativeToken) {
      return [
        nativeBalance,
        {
          token: sdk.config.tokens.depositToken,
          value: depositTokenBalance,
        },
        ...commonBalances,
      ]
    }

    return [
      nativeBalance,
      ...commonBalances,
    ]
  }, [
    depositTokenBalance,
    nativeTokenBalance,
    swiseTokenBalance,
    mintTokenBalance,
    isStakeNativeToken,
    sdk,
  ])

  return (
    <div className={className}>
      {
        balances.map(({ token, value }, index) => (
          <Balance
            key={token}
            className={cx({
              'mt-8': index,
            })}
            token={token}
            value={value}
            isFetching={isFetching}
          />
        ))
      }
    </div>
  )
}


export default React.memo(Balances)
