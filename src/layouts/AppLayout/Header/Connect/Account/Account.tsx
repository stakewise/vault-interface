import React, { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { autoUpdate, useFloating } from '@floating-ui/react-dom'
import { offset } from '@floating-ui/react'
import { commonMessages } from 'helpers'
import cx from 'classnames'

import { Button } from 'components'

import AccountMenu from './AccountMenu/AccountMenu'
import { useAccount } from './util'

import s from './Account.module.scss'


export type AccountProps = {
  className?: string
}

const Account: React.FC<AccountProps> = (props) => {
  const { className } = props

  const { logo, title } = useAccount()

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-end',
    middleware: [
      offset(() => ({
        mainAxis: 10,
        crossAxis: 56,
      })),
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <Popover className={cx(className, 'relative')}>
      <PopoverButton
        as={Fragment}
        ref={refs.setReference}
      >
        <Button
          logo={logo}
          title={title}
          color="light"
          dataTestId="account-button"
          ariaLabel={commonMessages.accessibility.openAccountMenu}
        />
      </PopoverButton>
      <PopoverPanel
        ref={refs.setFloating}
        className={cx(s.container, 'bg-background px-12 py-8 rounded-12 border border-dark/10 shadow-md z-menu')}
        style={floatingStyles}
      >
        <AccountMenu logo={logo} />
      </PopoverPanel>
    </Popover>
  )
}


export default React.memo(Account)
