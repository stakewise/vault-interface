import { createConnect, Connect } from './connect'
import { createDisconnect, Disconnect } from './disconnect'
import { createSetBalance, SetBalance } from './setBalance'
import { createSetEthBalance, SetEthBalance } from './setEthBalance'
import { createBalance } from './helpers'
import { createMonitorAddress, MonitorAddress } from './monitorAddress'
import { createCheckWalletList, CheckWalletList } from './checkWalletList'
import { createConnectWithBalance, ConnectWithBalance } from './connectWithBalance'
import { createInit, createState, Init } from './init'
import { createSwitchChain, SwitchChain } from './switchChain'


export type WalletFixture = {
  init: Init
  getAddress: () => string
  tryGetAddress: () => string | null
  switchChain: SwitchChain
  connect: Connect
  disconnect: Disconnect
  setBalance: SetBalance
  setEthBalance: SetEthBalance
  monitorAddress: MonitorAddress
  checkWalletList: CheckWalletList
  connectWithBalance: ConnectWithBalance
}

const wallet: E2E.Fixture<WalletFixture> = async ({ page, helpers, element, graphql }, use) => {
  const state = createState()

  const balance = createBalance({ state })
  const setEthBalance = createSetEthBalance({ state })
  const setBalance = createSetBalance({ balance, setEthBalance, graphql })

  const tryGetAddress = () => state.address || null

  const getAddress = () => {
    if (!state.address) {
      throw new Error('Wallet not initialized - call wallet.init() first')
    }

    return state.address
  }

  await use({
    init: createInit({ page, state }),
    getAddress,
    tryGetAddress,
    switchChain: createSwitchChain({ page, state }),
    connect: createConnect({ page, helpers }),
    disconnect: createDisconnect({ page, helpers }),
    monitorAddress: createMonitorAddress({ page }),
    checkWalletList: createCheckWalletList({ page, element }),
    connectWithBalance: createConnectWithBalance({ page, helpers, setBalance }),
    setEthBalance,
    setBalance,
  })
}


export default wallet
