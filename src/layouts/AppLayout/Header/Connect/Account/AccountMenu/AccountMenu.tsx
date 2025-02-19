import React from 'react'
import { useConfig } from 'config'
import { constants } from 'helpers'
import { useClaimsTotal } from 'hooks'

import type { LogoProps } from 'components'

import Menu from './Menu/Menu'
import Address from './Address/Address'
import Balances from './Balances/Balances'
import DisconnectButton from './DisconnectButton/DisconnectButton'
import ClaimAmountButton from './ClaimAmountButton/ClaimAmountButton'


type AccountMenuProps = {
  logo: LogoProps['name']
}

const AccountMenu: React.FC<AccountMenuProps> = (props) => {
  const { logo } = props

  const { activeWallet } = useConfig()
  const claimsTotal = useClaimsTotal()

  const isDappBrowser = activeWallet === constants.walletNames.dAppBrowser

  return (
    <>
      <Address
        className="mt-8"
        logo={logo}
      />
      <Balances className="mt-16" />
      {
        claimsTotal && (
          <ClaimAmountButton
            className="mt-8"
            amount={claimsTotal}
          />
        )
      }
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
