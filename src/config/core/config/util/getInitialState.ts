const getInitialState = (serverNetworkId?: NetworkIds): ConfigProvider.State => {
  const networkId = serverNetworkId || 'mainnet'

  return {
    networkId,
    address: null,
    connector: null,
    accountName: null,
    activeWallet: null,
    autoConnectChecked: false,
  }
}


export default getInitialState
