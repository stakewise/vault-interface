import networks from './config/util/networks'
import connectors from './connectors'


declare global {
  type ReadOnlyConnector = ReadOnlyConnectorType
  type NetworkIds = OneOfArray<typeof networks.ids>
  type Connectors = Unpromise<ReturnType<typeof connectors[WalletIds]['getConnector']>>

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
}
