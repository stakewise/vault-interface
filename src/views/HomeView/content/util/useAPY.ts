import { useCallback, useMemo, useRef } from 'react'
import { useFieldListener, useObjectState, useStore } from 'hooks'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'
import methods from 'helpers/methods'

import type { Input, Position } from './types'
import useGetApy from './useGetApy'

import messages from './messages'


type Item = Position

const storeSelector = (store: Store) => ({
  userAPY: store.vault.user.balances.userAPY,
})

const useAPY = ({ field, type }: Input) => {
  const { sdk } = useConfig()

  const { userAPY } = useStore(storeSelector)

  const initialStateRef = useRef({
    newAPY: userAPY,
    isFetching: false,
  })

  const [ { newAPY, isFetching }, setState ] = useObjectState(initialStateRef.current)

  const getAPY = useGetApy({ type })

  const handleGetAPY = useCallback(async (field: Forms.Field<bigint>) => {
    const inputValue = field.value
    const isValid = Number(inputValue) && !field.error

    if (!isValid) {
      setState(initialStateRef.current)

      return
    }

    setState({ isFetching: true })

    const newAPY = await getAPY(BigInt(inputValue || 0))

    if (inputValue === field.value) {
      setState({ newAPY, isFetching: false })
    }
  }, [ getAPY, setState ])

  useFieldListener(field, handleGetAPY, 300)

  return useMemo(() => {
    const prev: NonNullable<Item['textValue']>['prev'] = {
      message: methods.formatApy(userAPY),
      dataTestId: 'apy',
    }

    const next: NonNullable<Item['textValue']>['next'] = {
      dataTestId: 'apy',
    }

    const formattedAPY = methods.formatApy(newAPY)

    if (formattedAPY !== prev.message) {
      next.message = formattedAPY
    }

    const result: Item = {
      title: commonMessages.apy,
      textValue: {
        prev,
        next,
      },
      tooltip: {
        ...messages.tooltips.apy,
        values: {
          depositToken: sdk.config.tokens.depositToken,
        },
      },
      isFetching,
    }

    return result
  }, [ sdk, userAPY, newAPY, isFetching ])
}


export default useAPY
