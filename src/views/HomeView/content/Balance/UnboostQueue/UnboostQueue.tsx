import React, { useMemo } from 'react'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { QueueDuration, TextWithTooltip, Button } from 'components'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { ToggleBox, TokenList } from '../../../common'


const storeSelector = (store: Store) => ({
  unboostQueueData: store.vault.user.unboostQueue.data,
  exitingPercent: store.vault.user.balances.boost.exitingPercent,
})

type UnboostQueueProps = {
  className?: string
  isOpen: boolean
  handleOpen: () => void
}

const UnboostQueue: React.FC<UnboostQueueProps> = (props) => {
  const { className, isOpen, handleOpen } = props

  const { unboostQueue } = stakeCtx.useData()
  const { sdk, address, isReadOnlyMode } = useConfig()
  const { unboostQueueData, exitingPercent } = useStore(storeSelector)

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

  if (!exitingPercent || !address) {
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
            icon={{ size: 16, color: 'autumn' }}
            tooltip={commonMessages.tooltip.unboostPenalties}
            text={{ message: commonMessages.buttonTitle.unboostQueue }}
          />
          <QueueDuration
            duration={unboostQueueData.duration}
            dataTestId="unboost-queue-duration"
          />
        </div>
        <Button
          title={commonMessages.buttonTitle.claim}
          loading={unboostQueueData.isSubmitting}
          disabled={!unboostQueueData.isClaimable || isReadOnlyMode}
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
