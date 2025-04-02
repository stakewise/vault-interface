import { useEffect, useCallback } from 'react'
import { getAddress, BrowserProvider } from 'ethers'
import type { Eip1193Provider } from 'ethers'
import methods from 'sw-methods'

import networks from '../networks'


type Input = {
  chainId: number
  supportedNetworkIds: NetworkIds[]
  configState: ConfigProvider.ConfigState
  disconnect: () => Promise<void>
}

const useUpdateWallet = (values: Input) => {
  const { chainId, configState, supportedNetworkIds, disconnect } = values

  const { data, dataRef, setData } = configState
  const { address, autoConnectChecked } = data

  const handleENS = useCallback(async () => {
    const hasAccountName = Boolean(dataRef.current.accountName)
    const sdk = methods.getSDK({ chainId })

    if (address) {
      methods.ens.fetchName({
        address,
        chainId,
        provider: sdk.provider,
      })
        .then((accountName) => {
          setData({ accountName })
        })
        .catch(() => {
          if (hasAccountName) {
            setData({ accountName: null })
          }
        })
    }
    else if (hasAccountName) {
      setData({ accountName: null })
    }
  }, [ chainId, address, dataRef, setData ])

  useEffect(() => {
    handleENS()
  }, [ handleENS ])

  useEffect(() => {
    if (!autoConnectChecked) {
      return
    }

    const handleNetworkChanged = async (chainId: ChainIds) => {
      const networkId = networks.idByChain[chainId]
      const isSupported = supportedNetworkIds.includes(networkId)

      if (isSupported) {
        const oldChainId = networks.chainById[dataRef.current.networkId]

        if (chainId !== oldChainId) {
          const networkId = networks.idByChain[chainId]

          if (networkId) {
            const connector = dataRef.current.connector

            if (!connector) {
              return
            }

            const provider = await connector.getProvider()
            const library = new BrowserProvider(provider as Eip1193Provider)

            setData({ library, networkId })
          }
        }
      }
      else {
        disconnect()
      }
    }

    const handleAccountsChanged = (address: string) => {
      if (address) {
        setData({
          address: getAddress(address),
          accountName: null,
        })
      }
      else {
        disconnect()
      }
    }

    const handleUpdate = async (data: ConfigProvider.ConnectorData) => {
      const { account, chainId } = data

      const oldChainId = networks.chainById[dataRef.current.networkId]

      const isAccountChange = account && address !== account
      const isChainChange = chainId && oldChainId !== chainId

      if (isAccountChange) {
        handleAccountsChanged(account)
      }

      if (isChainChange) {
        handleNetworkChanged(chainId)
      }
    }

    const connector = dataRef.current.connector

    connector?.events?.subscribe('change', handleUpdate)
    connector?.events?.subscribe('disconnect', disconnect)

    return () => {
      connector?.events?.unsubscribe('change', handleUpdate)
      connector?.events?.unsubscribe('disconnect', disconnect)
    }
  }, [ autoConnectChecked, address, dataRef, supportedNetworkIds, disconnect, setData ])
}


export default useUpdateWallet
