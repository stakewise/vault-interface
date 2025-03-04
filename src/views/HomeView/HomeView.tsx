'use client'
import React from 'react'

import { ConnectWalletModal, SwitchAccountModal, TokenTransactionsModal } from 'layouts/modals'

import StakeContext from './StakeContext/StakeContext'


const vaultAddress = process.env.NEXT_PUBLIC_MAINNET_VAULT_ADDRESS || ''

const HomeView: React.FC = () => {
  if (!vaultAddress) {
    return null
  }

  return (
    <div className="width-container">
      <div className="max-w-[515rem] mx-auto mb-40 mt-96">
        <StakeContext vaultAddress={vaultAddress} />
        <ConnectWalletModal />
        <SwitchAccountModal />
        <TokenTransactionsModal />
      </div>
    </div>
  )
}


export default HomeView
