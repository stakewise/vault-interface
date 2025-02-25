import React, { useMemo } from 'react'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'

import { QueueDuration, Text, Button } from 'components'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { ToggleBox, TokenList } from '../../../common'


type UnstakeQueueProps = {
  className?: string
  isOpen: boolean
  handleOpen: () => void
}

const UnstakeQueue: React.FC<UnstakeQueueProps> = (props) => {
  const { className, isOpen, handleOpen } = props

  const { unstakeQueue } = stakeCtx.useData()
  const { sdk, isReadOnlyMode, address } = useConfig()

  const exiting = useMemo(() => {
    const title: Intl.Message = {
      ...commonMessages.exitingToken,
      values: { token: sdk.config.tokens.depositToken },
    }

    return {
      title,
      amount: unstakeQueue.total - unstakeQueue.withdrawable,
      token: sdk.config.tokens.depositToken,
      dataTestId: 'total-assets',
    }
  }, [ sdk, unstakeQueue ])

  const exited = useMemo(() => {
    const title: Intl.Message = {
      ...commonMessages.exitedToken,
      values: { token: sdk.config.tokens.depositToken },
    }

    return {
      title,
      token: sdk.config.tokens.depositToken,
      amount: unstakeQueue.withdrawable,
      dataTestId: 'exited-assets',
    }
  }, [ sdk, unstakeQueue ])

  const amounts = useMemo(() => [ exiting, exited ], [ exiting, exited ])

  if (!unstakeQueue.total || !address) {
    return null
  }

  return (
    <ToggleBox
      className={className}
      toggleContent={(
        <TokenList items={amounts} />
      )}
      isOpen={isOpen}
      dataTestId="unstake-queue"
      ariaLabel={commonMessages.accessibility.unstakeQueueToggle}
      handleOpen={handleOpen}
    >
      <div className="flex items-center justify-between">
        <div>
          <Text
            message={commonMessages.buttonTitle.unstakeQueue}
            color="moon"
            size="t14m"
          />
          <QueueDuration
            duration={unstakeQueue.duration}
            dataTestId="unstake-queue-duration"
          />
        </div>
        <Button
          title={commonMessages.buttonTitle.claim}
          loading={unstakeQueue.isSubmitting}
          disabled={!unstakeQueue.withdrawable || isReadOnlyMode}
          color="fancy-ocean"
          size="m"
          dataTestId="unstake-queue-claim-button"
          onClick={unstakeQueue.claim}
        />
      </div>
    </ToggleBox>
  )
}


export default React.memo(UnstakeQueue)
