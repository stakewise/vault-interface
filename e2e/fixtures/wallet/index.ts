import { createConnect, Connect } from './connect'
import { createDisconnect, Disconnect } from './disconnect'
import { createSetBalance, SetBalance } from './setBalance'
import { createMonitorAddress, MonitorAddress } from './monitorAddress'
import { createcheckWalletList, checkWalletList } from './checkWalletList'
import { createConnectWithBalance, ConnectWithBalance } from './connectWithBalance'


export type WalletFixture = {
  connect: Connect
  disconnect: Disconnect
  setBalance: SetBalance
  monitorAddress: MonitorAddress
  checkWalletList: checkWalletList
  connectWithBalance: ConnectWithBalance
}

const wallet: E2E.Fixture<WalletFixture> = async ({ gui, page, anvil, graphql, helpers, element }, use) => {
  await use({
    connect: createConnect({ page, helpers }),
    monitorAddress: createMonitorAddress({ page }),
    disconnect: createDisconnect({ page, helpers }),
    setBalance: createSetBalance({ anvil, gui, graphql }),
    checkWalletList: createcheckWalletList({ page, element }),
    connectWithBalance: createConnectWithBalance({ gui, page, anvil, graphql, helpers }),
  })
}


export default wallet
