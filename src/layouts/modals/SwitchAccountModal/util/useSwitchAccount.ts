import { useEffect, useCallback, useMemo } from 'react'
import { localStorage } from 'sdk'
import notifications from 'modules/notifications'
import { useObjectState } from 'hooks'
import { constants } from 'helpers'
import { useConfig } from 'config'

import type LedgerConnector from 'config/core/connectors/custom-connectors/LedgerConnector'
import { PathTypes } from 'config/core/connectors/custom-connectors/LedgerConnector/LedgerProvider'

import messages from '../messages'


type Output = {
  address: string | null | undefined
  accounts: string[]
  isFetching: boolean
  nextPathType: PathItem
  onSelectAddress: (address: string) => void
  onChangePathType: (pathType: PathTypes) => void
}

type PathItem = {
  cache: string[]
  type: PathTypes
  title: Intl.Message
}

const livePathData: PathItem = {
  cache: [],
  type: PathTypes.LIVE,
  title: messages.types.live,
}

const legacyPathData: PathItem = {
  cache: [],
  type: PathTypes.LEGACY,
  title: messages.types.legacy,
}

const bip44PathData: PathItem = {
  cache: [],
  type: PathTypes.BIP44,
  title: messages.types.bip44,
}

const paths = [ livePathData, legacyPathData, bip44PathData ]

const findPath = (type: PathTypes): PathItem => paths.find((item) => item.type === type) as PathItem

const findNextPath = (type: PathTypes): PathItem => {
  const index = paths.findIndex((item) => item.type === type)
  const nextPath = paths[index + 1]

  return nextPath || paths[0]
}

const useSwitchAccount = (closeModal: () => void): Output => {
  const { address, connector: ledgerConnector } = useConfig()

  const connector = ledgerConnector as LedgerConnector
  const initialPathType = connector?.pathType as PathTypes
  const currentPathItem = findPath(initialPathType)

  const [ { accounts, pathType, isFetching }, setState ] = useObjectState<{
    pathType: PathTypes
    accounts: Output['accounts']
    isFetching: Output['isFetching']
  }>({
    pathType: initialPathType,
    accounts: currentPathItem.cache,
    isFetching: !currentPathItem.cache.length,
  })

  const fetchAddresses = useCallback((pathType: PathTypes) => {
    const pathItem = findPath(pathType)

    if (pathItem.cache.length) {
      setState({
        pathType,
        isFetching: false,
        accounts: pathItem.cache,
      })

      return
    }

    if (connector?.getAccounts) {
      connector.getAccounts(0, 6)
        .then((accounts: Output['accounts']) => {
          pathItem.cache = accounts

          setState({
            accounts,
            pathType,
            isFetching: false,
          })
        })
    }
  }, [ connector, setState ])

  const handleChangePathType = useCallback((pathType: PathTypes) => {
    if (connector?.setPathType) {
      setState({ isFetching: true })

      connector.setPathType(pathType)
        .then(() => {
          fetchAddresses(pathType)
        })
    }
  }, [ connector, fetchAddresses, setState ])

  useEffect(() => {
    fetchAddresses(initialPathType)
  }, [ fetchAddresses, initialPathType ])

  const handleSelectAddress = useCallback((address: string) => {
    const index = accounts.indexOf(address)

    if (index !== -1 && connector?.setActiveAccount) {
      connector?.setActiveAccount(index)
        .then(() => {
          localStorage.setItem(constants.localStorageNames.ledgerSelectedAccount, {
            index,
            pathType,
          })

          notifications.open({
            type: 'success',
            text: messages.successNotification,
          })
        })
    }

    closeModal()
  }, [ accounts, closeModal, connector, pathType ])

  return useMemo(() => ({
    address,
    accounts,
    isFetching,
    nextPathType: findNextPath(pathType),
    onSelectAddress: handleSelectAddress,
    onChangePathType: handleChangePathType,
  }), [ accounts, address, handleChangePathType, handleSelectAddress, isFetching, pathType ])
}


export default useSwitchAccount
