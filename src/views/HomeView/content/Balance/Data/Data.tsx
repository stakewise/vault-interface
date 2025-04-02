import React from 'react'
import methods from 'helpers/methods'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import Row from './Row/Row'

import messages from './messages'


const storeSelector = (store: Store) => ({
  stakedAssets: store.vault.user.balances.stake.assets,
  boostedShares: store.vault.user.balances.boost.shares,
})

const Data: React.FC = () => {
  const { sdk } = useConfig()
  const { data } = stakeCtx.useData()

  const { stakedAssets, boostedShares } = useStore(storeSelector)

  const depositToken = sdk.config.tokens.depositToken

  return (
    <>
      <Row
        className="pb-12"
        text={commonMessages.yourApy}
        tooltip={{
          ...messages.tooltips.apy,
          values: { depositToken },
        }}
        isFetching={data.isFetching}
        value={methods.formatApy(data.apy.user)}
        isMagicValue={Boolean(boostedShares)}
        dataTestId="user-apy"
      />
      <Row
        className="py-12 border-top border-dark/10"
        text={messages.stake}
        tooltip={{
          ...messages.tooltips.stake,
          values: { depositToken },
        }}
        isFetching={data.isFetching}
        dataTestId="user-stake"
        value={{
          amount: stakedAssets,
          token: sdk.config.tokens.depositToken,
        }}
      />
      <Row
        className="py-12 border-top border-dark/10"
        text={commonMessages.earnedRewards}
        tooltip={commonMessages.tooltip.earnedRewards}
        isFetching={data.isFetching}
        dataTestId="user-rewards"
        withMinimalValue
        value={{
          amount: data.userRewards,
          token: sdk.config.tokens.depositToken,
        }}
      />
    </>
  )
}


export default React.memo(Data)
