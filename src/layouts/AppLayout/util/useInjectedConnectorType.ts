import { useEffect, useCallback } from 'react'
import { useActions } from 'hooks'
import methods from 'sw-methods'


const useInjectedConnectorType = () => {
  const actions = useActions()

  const checkMMI = useCallback(async () => {
    const provider = methods.getInjectedProvider('metaMask')

    if (typeof provider?.request === 'function') {
      try {
        const isMMI = await window.ethereum.request({
          method: 'metamaskinstitutional_supported',
        })

        if (isMMI) {
          actions.account.wallet.setMMI(true)
        }
      }
      catch {}
    }
  }, [ actions ])

  useEffect(() => {
    checkMMI()
  }, [ checkMMI ])
}


export default useInjectedConnectorType
