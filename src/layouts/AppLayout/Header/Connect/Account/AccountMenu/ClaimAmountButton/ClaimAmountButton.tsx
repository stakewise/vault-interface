import React from 'react'
import intl from 'sw-modules/intl'
import { commonMessages } from 'helpers'

import { Button } from 'components'
import { openDistributorClaimsModal } from 'layouts/modals'


type ClaimAmountButtonProps = {
  className?: string
  amount: string
}

const ClaimAmountButton: React.FC<ClaimAmountButtonProps> = (props) => {
  const { className, amount } = props

  const { formatMessage } = intl.useIntl()

  return (
    <Button
      className={className}
      title={`${formatMessage(commonMessages.buttonTitle.claim)} ${amount}`}
      color="fancy-ocean"
      size="m"
      fullWidth
      onClick={openDistributorClaimsModal}
    />
  )
}


export default React.memo(ClaimAmountButton)
