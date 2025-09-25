import React from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { methods } from 'helpers'

import { Note } from 'components'

import messages from './messages'


const storeSelector = (store: Store) => ({
  walletMintedShares: store.account.balances.mintToken,
  mintedShares: store.vault.user.balances.mintToken.mintedShares,
})

const MintTokenBalanceNote: React.FC = () => {
  const { sdk } = useConfig()
  const { mintedShares, walletMintedShares } = useStore(storeSelector)

  const isInsufficientWalletBalance = mintedShares > walletMintedShares

  if (!isInsufficientWalletBalance) {
    return null
  }

  const diff = mintedShares - walletMintedShares

  const text = {
    ...messages.note,
    values: {
      diff: methods.formatTokenValue(diff),
      mintToken: sdk.config.tokens.mintToken,
    },
  }

  return (
    <Note
      className="mt-24"
      text={text}
      type="warning"
      center
    />
  )
}


export default React.memo(MintTokenBalanceNote)
