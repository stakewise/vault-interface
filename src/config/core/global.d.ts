import wallets from './wallets'


const walletsIds = Object.values(wallets).map(({ id }) => id)

declare global {
  type WalletIds = typeof walletsIds[number]
  type ReadOnlyConnector = ReadOnlyConnectorType
  type NetworkIds = 'mainnet' | 'gnosis' | 'hoodi'
  type Connectors = Unpromise<ReturnType<typeof wallets[WalletIds]['getConnector']>>
  type RefObject<T> = { current: T }

  namespace LocalStorageData {

    type SavedNetwork = {
      id: string
      chainId: number
    }

    type LedgerSelectedAccount = {
      index: number
      pathType: LedgerPathTypes
    }
  }

  type GetConnectorOptions = {
    transport?: 'usb' | 'ble'
    disconnect?: () => void
    networks: ConfigProvider.Networks
  }
}
