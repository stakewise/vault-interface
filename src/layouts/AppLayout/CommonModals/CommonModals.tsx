import React from 'react'

import {
  GuideModal,
  TxCompletedModal,
  SwitchAccountModal,
  ConnectWalletModal,
  ExportRewardsModal,
  TransactionsFlowModal,
  DistributorClaimsModal,
} from 'layouts/modals'


const CommonModals: React.FC = () => (
  <>
    <GuideModal />
    <TxCompletedModal />
    <ExportRewardsModal />
    <ConnectWalletModal />
    <SwitchAccountModal />
    <TransactionsFlowModal />
    <DistributorClaimsModal />
  </>
)


export default React.memo(CommonModals)
