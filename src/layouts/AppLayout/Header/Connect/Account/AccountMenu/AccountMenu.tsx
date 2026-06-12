import React from 'react'
import { useConfig, wallets } from 'config'
import { useClaimsTotal } from 'hooks'

import Menu from './Menu/Menu'
import Address from './Address/Address'
import Balances from './Balances/Balances'
import DisconnectButton from './DisconnectButton/DisconnectButton'
import ClaimAmountButton from './ClaimAmountButton/ClaimAmountButton'


type AccountMenuProps = {
  logo: string
}

const disableDisconnect = new Set<string>([
  wallets.dAppBrowser.id,
  wallets.ledgerLive.id,
])

const AccountMenu: React.FC<AccountMenuProps> = (props) => {
  const { logo } = props

  const { activeWallet } = useConfig()
  const claimsTotal = useClaimsTotal()

  const shouldShowDisconnect = activeWallet !== null && !disableDisconnect.has(activeWallet)

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
        shouldShowDisconnect && (
          <DisconnectButton className="mt-8" />
        )
      }
    </>
  )
}


export default React.memo(AccountMenu)
