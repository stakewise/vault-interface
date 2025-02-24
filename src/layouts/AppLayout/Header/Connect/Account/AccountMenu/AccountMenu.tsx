import React from 'react'
import { useConfig } from 'config'
import { constants } from 'helpers'

import type { LogoProps } from 'components'

import Menu from './Menu/Menu'
import Address from './Address/Address'
import Balances from './Balances/Balances'
import DisconnectButton from './DisconnectButton/DisconnectButton'


type AccountMenuProps = {
  logo: LogoProps['name']
}

const AccountMenu: React.FC<AccountMenuProps> = (props) => {
  const { logo } = props

  const { activeWallet } = useConfig()

  const isDappBrowser = activeWallet === constants.walletNames.dAppBrowser

  return (
    <>
      <Address
        className="mt-8"
        logo={logo}
      />
      <Balances className="mt-16" />
      <Menu className="mt-16" />
      {
        !isDappBrowser && (
          <DisconnectButton className="mt-8" />
        )
      }
    </>
  )
}


export default React.memo(AccountMenu)
