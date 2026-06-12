const getConnector = async (_: any, options: GetConnectorOptions) => {
  if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_ID) {
    throw new Error("You need to provide NEXT_PUBLIC_WALLET_CONNECT_ID env variable")
  }

  const WalletLinkConnector = (await import('../../connectors/WalletLinkConnector')).default

  return new WalletLinkConnector({
    ...options,
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
    isNewChainsStale: false,
    showQrModal: true,
    qrModalOptions: {
      themeVariables: {
        '--wcm-z-index': '999',
      },
    },
  })
}


export default getConnector
