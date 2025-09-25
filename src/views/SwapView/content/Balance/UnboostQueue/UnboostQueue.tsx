import React, { useMemo } from 'react'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { QueueDuration, TextWithTooltip, Button } from 'components'
import { swapCtx } from 'views/SwapView/util'


import { ToggleBox, TokenList } from '../../../common'


const storeSelector = (store: Store) => ({
  unboostQueueData: store.vault.user.unboostQueue.data,
  boostExitingPercent: store.vault.user.balances.boost.exitingPercent,
})

type UnboostQueueProps = {
  className?: string
  isOpen: boolean
  handleOpen: () => void
}

const UnboostQueue: React.FC<UnboostQueueProps> = (props) => {
  const { className, isOpen, handleOpen } = props

  const { sdk, address } = useConfig()
  const { unboostQueue } = swapCtx.useData()
  const { unboostQueueData, boostExitingPercent } = useStore(storeSelector)

  const text = unboostQueueData.isClaimable
    ? commonMessages.exitedToken
    : commonMessages.exitingToken

  const shares = useMemo(() => {
    const title: Intl.Message = {
      ...text,
      values: { token: sdk.config.tokens.mintToken },
    }

    return {
      title,
      amount: unboostQueueData.exitingShares,
      token: sdk.config.tokens.mintToken,
      dataTestId: 'exiting-shares',
    }
  }, [ sdk, text, unboostQueueData ])

  const rewards = useMemo(() => {
    const title: Intl.Message = {
      ...text,
      values: { token: sdk.config.tokens.depositToken },
    }

    return {
      title,
      amount: unboostQueueData.exitingAssets,
      token: sdk.config.tokens.depositToken,
      dataTestId: 'exiting-rewards',
    }
  }, [ sdk, text, unboostQueueData ])

  const amounts = useMemo(() => (
    unboostQueueData.exitingAssets ? [ shares, rewards ] : [ shares ]
  ), [ shares, rewards, unboostQueueData ])

  const hideDuration = unboostQueueData.isClaimable

  if (!boostExitingPercent || !address) {
    return null
  }

  return (
    <ToggleBox
      className={className}
      toggleContent={(
        <TokenList items={amounts} />
      )}
      isOpen={isOpen}
      dataTestId="unboost-queue"
      ariaLabel={commonMessages.accessibility.unboostQueueToggle}
      handleOpen={handleOpen}
    >
      <div className="flex items-center justify-between">
        <div>
          <TextWithTooltip
            icon={{ size: 16, color: 'warning' }}
            tooltip={commonMessages.tooltip.unboostPenalties}
            text={{ message: commonMessages.buttonTitle.unboostQueue }}
          />
          {
            !hideDuration && (
              <QueueDuration
                duration={unboostQueueData.duration}
                dataTestId="unboost-queue-duration"
              />
            )
          }
        </div>
        <Button
          title={commonMessages.buttonTitle.claim}
          loading={unboostQueue.isClaimUnboostQueueLoading}
          disabled={unboostQueue.isClaimUnboostQueueDisabled}
          color="primary"
          size="m"
          dataTestId="unboost-queue-claim-button"
          onClick={unboostQueue.claim}
        />
      </div>
    </ToggleBox>
  )
}


export default React.memo(UnboostQueue)
