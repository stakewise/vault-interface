import React, { useCallback } from 'react'
import { commonMessages } from 'helpers'
import device from 'modules/device'
import { useConfig } from 'config'
import cx from 'classnames'

import { Button } from 'components'
import { openExportRewardsModal } from 'layouts/modals/ExportRewardsModal/ExportRewardsModal'


type ExportButtonProps = {
  className?: string
  vaultAddress: string
  onClick?: () => void
}

const ExportButton: React.FC<ExportButtonProps> = (props) => {
  const { className, vaultAddress, onClick } = props

  const { address } = useConfig()
  const { isDesktop } = device.useData()

  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick()
    }

    openExportRewardsModal({ vaultAddress })
  }, [ vaultAddress, onClick ])

  return (
    <>
      {
        !isDesktop ? (
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
