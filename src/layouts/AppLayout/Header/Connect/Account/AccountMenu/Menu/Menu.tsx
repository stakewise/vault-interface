import React, { useMemo } from 'react'
import cx from 'classnames'
import { useConfig } from 'config'
import { constants } from 'helpers'

import MenuItem from './MenuItem/MenuItem'
import { openSwitchAccountModal } from 'layouts/modals'

import messages from './messages'


type MenuProps = {
  className?: string
}

const Menu: React.FC<MenuProps> = (props) => {
  const { className } = props

  const { activeWallet } = useConfig()

  const items = useMemo(() => {
    const isLedger = activeWallet === constants.walletNames.ledger

    if (isLedger) {
      return [
        {
          title: messages.switchAccount,
          onClick: openSwitchAccountModal,
        },
      ]
    }

    return []
  }, [ activeWallet ])

  if (!items.length) {
    return null
  }

  return (
    <div className={cx(className, 'border-top border-secondary/30 pt-16 pb-8')}>
      {
        items.map((item, index) => (
          <MenuItem
            key={index}
            className={index ? 'mt-16' : undefined}
            {...item}
          />
        ))
      }
    </div>
  )
}


export default React.memo(Menu)
