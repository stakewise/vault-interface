import React, { useMemo } from 'react'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { QueueDuration, Text, Button } from 'components'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { TokenList, ToggleBox } from '../../../common'


const storeSelector = (store: Store) => ({
  exitQueueData: store.vault.user.exitQueue.data,
  isFetching: store.vault.user.exitQueue.isFetching,
})

type UnstakeQueueProps = {
  className?: string
  isOpen: boolean
  handleOpen: () => void
}

const UnstakeQueue: React.FC<UnstakeQueueProps> = (props) => {
  const { className, isOpen, handleOpen } = props

  const { exitQueueData, isFetching } = useStore(storeSelector)
  const { unstakeQueue } = stakeCtx.useData()
  const { sdk, isReadOnlyMode, address } = useConfig()

  const exiting = useMemo(() => {
    const title: Intl.Message = {
      ...commonMessages.exitingToken,
      values: { token: sdk.config.tokens.depositToken },
    }

    return {
      title,
      amount: exitQueueData.total - exitQueueData.withdrawable,
      token: sdk.config.tokens.depositToken,
      dataTestId: 'total-assets',
    }
  }, [ sdk, exitQueueData ])

  const exited = useMemo(() => {
    const title: Intl.Message = {
      ...commonMessages.exitedToken,
      values: { token: sdk.config.tokens.depositToken },
    }

    return {
      title,
      token: sdk.config.tokens.depositToken,
      amount: exitQueueData.withdrawable,
      dataTestId: 'exited-assets',
    }
  }, [ sdk, exitQueueData ])

  const amounts = useMemo(() => [ exiting, exited ], [ exiting, exited ])

  if (!exitQueueData.total || !address) {
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
            color="dark"
            size="t14m"
          />
          <QueueDuration
            duration={exitQueueData.duration}
            isClaimable={Boolean(exitQueueData.withdrawable)}
            dataTestId="unstake-queue-duration"
          />
        </div>
        <Button
          title={commonMessages.buttonTitle.claim}
          loading={isFetching}
          disabled={!exitQueueData.withdrawable || isReadOnlyMode}
          color="primary"
          size="m"
          dataTestId="unstake-queue-claim-button"
          onClick={() => unstakeQueue.claim(exitQueueData)}
        />
      </div>
    </ToggleBox>
  )
}


export default React.memo(UnstakeQueue)
