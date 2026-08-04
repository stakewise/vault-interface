import React, { useMemo } from 'react'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { QueueDuration, Text, Button } from 'components'
import { swapCtx } from 'views/SwapView/util'

import { TokenList, ToggleBox } from '../../../common'


const storeSelector = (store: Store) => ({
  unstakeQueueData: store.vault.user.unstakeQueue.data,
})

type UnstakeQueueProps = {
  className?: string
  isOpen: boolean
  handleOpen: () => void
}

const UnstakeQueue: React.FC<UnstakeQueueProps> = (props) => {
  const { className, isOpen, handleOpen } = props

  const { sdk, address } = useConfig()
  const { unstakeQueue } = swapCtx.useData()
  const { unstakeQueueData } = useStore(storeSelector)

  const exiting = useMemo(() => {
    const title: Intl.Message = {
      ...commonMessages.exitingToken,
      values: { token: sdk.config.tokens.depositToken },
    }

    return {
      title,
      amount: unstakeQueueData.total - unstakeQueueData.withdrawable,
      token: sdk.config.tokens.depositToken,
      dataTestId: 'total-assets',
    }
  }, [ sdk, unstakeQueueData ])

  const exited = useMemo(() => {
    const title: Intl.Message = {
      ...commonMessages.exitedToken,
      values: { token: sdk.config.tokens.depositToken },
    }

    return {
      title,
      token: sdk.config.tokens.depositToken,
      amount: unstakeQueueData.withdrawable,
      dataTestId: 'exited-assets',
    }
  }, [ sdk, unstakeQueueData ])

  const amounts = useMemo(() => [ exiting, exited ], [ exiting, exited ])

  const hideDuration = unstakeQueueData.total === unstakeQueueData.withdrawable

  if (!unstakeQueueData.total || !address) {
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
            className="font-medium"
            message={commonMessages.buttonTitle.unstakeQueue}
            color="dark"
            size="sm"
          />
          {
            !hideDuration && (
              <QueueDuration
                duration={unstakeQueueData.duration}
                dataTestId="unstake-queue-duration"
              />
            )
          }
        </div>
        <Button
          title={commonMessages.buttonTitle.claim}
          loading={unstakeQueue.isClaimUnstakeQueueLoading}
          disabled={unstakeQueue.isClaimUnstakeQueueDisabled}
          color="primary"
          size="m"
          dataTestId="unstake-queue-claim-button"
          onClick={unstakeQueue.claim}
        />
      </div>
    </ToggleBox>
  )
}


export default React.memo(UnstakeQueue)
