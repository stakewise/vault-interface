import networks from './config/util/networks'
import wallets from './wallets'


const walletsIds = Object.values(wallets).map(({ id }) => id)

declare global {
  type WalletIds = typeof walletsIds[number]
  type NetworkIds = OneOfArray<typeof networks.ids>
  type Connectors = Unpromise<ReturnType<typeof wallets[WalletIds]['getConnector']>>

  namespace LocalStorageData {

    type SavedNetwork = {
      id: NetworkIds
      chainId: ChainIds
    }

    type LedgerSelectedAccount = {
      index: number
      pathType: LedgerPathTypes
    }
  }

  type GetConnectorOptions = {
    transport?: 'usb' | 'ble'
    disconnect?: () => void
  }
}
