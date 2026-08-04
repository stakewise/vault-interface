import React, { useMemo } from 'react'
import cx from 'classnames'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { commonMessages, methods } from 'helpers'

import { TextWithTooltip } from 'components'

import Content, { ContentProps } from './Content/Content'

import messages from './messages'


type DataItem = ContentProps & {
  title: Intl.Message
  tooltip?: Intl.Message
}

const storeSelector = (store: Store) => ({
  userApy: store.vault.user.balances.userAPY,
  stakedAssets: store.vault.user.balances.stakedAssets,
  boostedShares: store.vault.user.balances.boost.shares,
  mintedShares: store.vault.user.balances.mintToken.mintedShares,
  boostedTotalShares: store.vault.user.balances.boost.totalShares,
  totalEarnedAssets: store.vault.user.balances.totalEarnedAssets,
})

const Data: React.FC = () => {
  const { sdk, isEthereum } = useConfig()

  const {
    userApy,
    mintedShares,
    stakedAssets,
    boostedShares,
    boostedTotalShares,
    totalEarnedAssets,
  } = useStore(storeSelector)

  const items = useMemo(() => {
    const mintToken = sdk.config.tokens.mintToken
    const depositToken = sdk.config.tokens.depositToken

    const items: DataItem[] = [
      {
        title: commonMessages.yourApy,
        tooltip: {
          ...messages.tooltips.apy,
          values: { depositToken },
        },
        value: methods.formatApy(userApy),
        isMagicValue: Boolean(boostedShares),
        dataTestId: 'user-apy',
      },
      {
        title: messages.stake,
        tooltip: {
          ...messages.tooltips.stake,
          values: { depositToken },
        },
        value: {
          amount: stakedAssets,
          token: depositToken,
        },
        dataTestId: 'user-stake',
      },
      {
        title: messages.mint,
        tooltip: {
          ...messages.tooltips.mint,
          values: {
            mintToken,
            depositToken,
          },
        },
        value: {
          amount: mintedShares,
          token: mintToken,
        },
        dataTestId: 'user-mint',
      },
      {
        title: commonMessages.earnedRewards,
        tooltip: commonMessages.tooltip.earnedRewards,
        value: {
          amount: totalEarnedAssets,
          token: depositToken,
        },
        withMinimalValue: true,
        dataTestId: 'user-rewards',
      },
    ]

    if (isEthereum) {
      items.push({
        title: messages.boosted,
        tooltip: {
          ...messages.tooltips.boosted,
          values: { depositToken, mintToken },
        },
        value: {
          amount: boostedTotalShares,
          token: mintToken,
        },
        dataTestId: 'user-boost',
      })
    }

    return items
  }, [
    sdk,
    userApy,
    isEthereum,
    mintedShares,
    stakedAssets,
    boostedShares,
    totalEarnedAssets,
    boostedTotalShares,
  ])

  return (
    <>
      {
        items.map(({ title, tooltip, value, isMagicValue, withMinimalValue, dataTestId }, index) => {
          return (
            <div
              key={index}
              className={cx('flex justify-between items-center', {
                'pb-12': !index,
                'py-12 border-top border-dark/10': index,
              })}
            >
              <div>
                <TextWithTooltip
                  message={title}
                  color="dark"
                  size="sm"
                  tooltip={tooltip}
                />
              </div>
              <div>
                <div className="flex justify-end">
                  <Content
                    value={value}
                    dataTestId={dataTestId}
                    isMagicValue={isMagicValue}
                    withMinimalValue={withMinimalValue}
                  />
                </div>
              </div>
            </div>
          )
        })
      }
    </>
  )
}


export default React.memo(Data)
