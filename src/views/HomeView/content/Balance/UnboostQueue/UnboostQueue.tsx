import React, { useMemo } from 'react'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'

import { QueueDuration, TextWithTooltip, Button } from 'components'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { ToggleBox, TokenList } from '../../../common'


type UnboostQueueProps = {
  className?: string
  isOpen: boolean
  handleOpen: () => void
}

const UnboostQueue: React.FC<UnboostQueueProps> = (props) => {
  const { className, isOpen, handleOpen } = props

  const { unboostQueue, data } = stakeCtx.useData()
  const { sdk, address, isReadOnlyMode } = useConfig()

  const text = unboostQueue.isClaimable
    ? commonMessages.exitedToken
    : commonMessages.exitingToken

  const shares = useMemo(() => {
    const title: Intl.Message = {
      ...text,
      values: { token: sdk.config.tokens.mintToken },
    }

    return {
      title,
      amount: unboostQueue.exitingShares,
      token: sdk.config.tokens.mintToken,
      dataTestId: 'exiting-shares',
    }
  }, [ sdk, text, unboostQueue ])

  const rewards = useMemo(() => {
    const title: Intl.Message = {
      ...text,
      values: { token: sdk.config.tokens.depositToken },
    }

    return {
      title,
      amount: unboostQueue.exitingAssets,
      token: sdk.config.tokens.depositToken,
      dataTestId: 'exiting-rewards',
    }
  }, [ sdk, text, unboostQueue ])

  const amounts = useMemo(() => (
    unboostQueue.exitingAssets ? [ shares, rewards ] : [ shares ]
  ), [ shares, rewards, unboostQueue ])

  if (!data.boost.exitingPercent || !address) {
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
            duration={unboostQueue.duration}
            dataTestId="unboost-queue-duration"
          />
        </div>
        <Button
          title={commonMessages.buttonTitle.claim}
          loading={unboostQueue.isSubmitting}
          disabled={!unboostQueue.isClaimable || isReadOnlyMode}
          color="fancy-ocean"
          size="m"
          dataTestId="unboost-queue-claim-button"
          onClick={unboostQueue.claim}
        />
      </div>
    </ToggleBox>
  )
}


export default React.memo(UnboostQueue)
