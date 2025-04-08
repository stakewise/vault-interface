import React, { useMemo } from 'react'
import cx from 'classnames'
import methods from 'helpers/methods'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'

import { Text, PopupInfo, TextWithTooltip } from 'components'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import Details from './Details/Details'
import Content from './Content/Content'

import { useApyDetails } from './util'

import messages from './messages'


const storeSelector = (store: Store) => ({
  apy: store.vault.base.data.apy,
  isMoreV2: store.vault.base.data.versions.isMoreV2,
  maxBoostApy: store.vault.base.data.allocatorMaxBoostApy,
  stakedAssets: store.vault.user.balances.stake.assets,
  mintedShares: store.vault.user.balances.mintToken.minted.shares,
  boostedShares: store.vault.user.balances.boost.shares,
})


const Data: React.FC = () => {
  const { sdk } = useConfig()
  const { data } = stakeCtx.useData()

  const { data: apyDetails, isFetching } = useApyDetails()
  const { apy, isMoreV2, maxBoostApy, stakedAssets, mintedShares, boostedShares } = useStore(storeSelector)

  const isBoostProfitable = maxBoostApy > apy
  const isPopupEnabled = Boolean(isBoostProfitable && isMoreV2 && apyDetails?.length)

  const items = useMemo(() => {
    const mintToken = sdk.config.tokens.mintToken
    const depositToken = sdk.config.tokens.depositToken

    return [
      {
        title: commonMessages.yourApy,
        tooltip: {
          ...messages.tooltips.apy,
          values: { depositToken },
        },
        value: methods.formatApy(data.apy.user),
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
          values: { mintToken },
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
          amount: data.userRewards,
          token: depositToken,
        },
        withMinimalValue: true,
        dataTestId: 'user-rewards',
      },
    ]
  }, [ sdk, data, stakedAssets, mintedShares, boostedShares ])

  return (
    <>
      {
        items.map(({ title, tooltip, value, isMagicValue, withMinimalValue, dataTestId }, index) => {
          const contentNode = (
            <Content
              value={value}
              isFetching={isFetching}
              dataTestId={dataTestId}
              isMagicValue={isMagicValue}
              withMinimalValue={withMinimalValue}
            />
          )

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
                  text={{
                    message: title,
                    color: 'dark',
                    size: 't14m',
                  }}
                  tooltip={tooltip}
                />
              </div>
              <div className="flex justify-end items-center">
                {
                  index || !isPopupEnabled ? (
                    contentNode
                  ) : (
                    <PopupInfo
                      headNode={(
                        <div>
                          <div className="flex justify-end">
                            {contentNode}
                          </div>
                          <Text
                            className="underline opacity-60"
                            message={messages.breakdown}
                            size="t12m"
                            color="dark"
                          />
                        </div>
                      )}
                    >
                      <Details data={apyDetails} />
                    </PopupInfo>
                  )
                }
              </div>
            </div>
          )
        })
      }
    </>
  )
}


export default React.memo(Data)
