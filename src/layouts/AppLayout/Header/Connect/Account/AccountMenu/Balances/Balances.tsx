import React, { useMemo } from 'react'
import { useConfig } from 'config'
import { useStore } from 'hooks'
import cx from 'classnames'

import Balance from './Balance/Balance'


type BalancesProps = {
  className?: string
}

const storeSelector = (store: Store) => ({
  mintTokenBalance: store.account.balances.mintToken,
  nativeTokenBalance: store.account.balances.nativeToken,
  depositTokenBalance: store.account.balances.depositToken,
  isFetching: store.account.balances.isFetching,
})

const Balances: React.FC<BalancesProps> = (props) => {
  const { className } = props

  const { sdk } = useConfig()

  const isStakeNativeToken = sdk.config.tokens.depositToken === sdk.config.tokens.nativeToken

  const {
    depositTokenBalance,
    nativeTokenBalance,
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
