import React, { useCallback } from 'react'
import { commonMessages } from 'helpers'
import device from 'modules/device'
import { useConfig } from 'config'
import cx from 'classnames'

import { Button } from 'components'
import { openExportRewardsModal } from 'layouts/modals'
import { stakeCtx } from 'views/HomeView/StakeContext/util'


type ExportButtonProps = {
  className?: string
  closeModal: () => void
}

const ExportButton: React.FC<ExportButtonProps> = (props) => {
  const { className, closeModal } = props

  const { address } = useConfig()
  const { isMobile } = device.useData()
  const { vaultAddress } = stakeCtx.useData()

  const handleClick = useCallback(() => {
    if (vaultAddress) {
      closeModal()
      openExportRewardsModal({ vaultAddress, statsType: 'allocator' })
    }
  }, [ vaultAddress, closeModal ])

  return (
    <>
      {
        isMobile ? (
          <Button
            size="s"
            color="light"
            icon="icon/upload"
            dataTestId="export-rewards-button"
            ariaLabel={commonMessages.accessibility.exportRewardsButton}
            onClick={handleClick}
          />
        ) : (
          <Button
            className={cx(className, 'px-16')}
            ariaLabel={commonMessages.accessibility.exportRewardsButton}
            title={commonMessages.buttonTitle.export}
            dataTestId="export-rewards-button"
            disabled={!address}
            color="light"
            withoutPadding
            size="s"
            onClick={handleClick}
          />
        )
      }
    </>

  )
}


export default React.memo(ExportButton)
