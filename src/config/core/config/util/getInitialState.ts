const getInitialState = (serverNetworkId?: string): ConfigProvider.State => {
  const networkId = serverNetworkId || 'mainnet'

  return {
    networkId,
    address: null,
    connector: null,
    accountName: null,
    activeWallet: null,
    walletConnectData: null,
    autoConnectChecked: false,
  }
}


export default getInitialState
