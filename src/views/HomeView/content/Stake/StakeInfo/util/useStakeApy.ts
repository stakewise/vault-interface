import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFieldListener, useObjectState, useStore } from 'hooks'
import methods from 'helpers/methods'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Position as Item, useGetApy } from 'views/HomeView/content/util'
import messages from 'views/HomeView/content/util/messages'


const storeSelector = (store: Store) => ({
  userAPY: store.vault.user.balances.userAPY,
})

type Input = {
  getBuyAmount: (value: bigint) => bigint
  isSwapQuoteFetching: boolean
}

const useStakeApy = ({ getBuyAmount, isSwapQuoteFetching }: Input) => {
  const { sdk } = useConfig()
  const { field, stake } = stakeCtx.useData()

  const { userAPY } = useStore(storeSelector)

  const initialStateRef = useRef({
    newAPY: userAPY,
    isFetching: false,
  })

  const [ { newAPY, isFetching }, setState ] = useObjectState(initialStateRef.current)

  const swapToken = stake.swapTokens.selected

  const getAPY = useGetApy({ type: 'stake' })

  const handleGetAPY = useCallback(async () => {
    const inputValue = field.value || 0n
    const isValid = inputValue && !field.error

    if (!isValid) {
      setState(initialStateRef.current)

      return
    }

    const amount = swapToken.address ? getBuyAmount(inputValue) : inputValue

    setState({ isFetching: true })

    const newAPY = await getAPY(amount)

    if (inputValue === field.value) {
      setState({ newAPY, isFetching: false })
    }
  }, [ field, swapToken, getAPY, getBuyAmount, setState ])

  useFieldListener(field, handleGetAPY, 300)

  useEffect(() => {
    handleGetAPY()
  }, [ handleGetAPY ])

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
      isFetching: isFetching || isSwapQuoteFetching,
    }

    return result
  }, [ sdk, userAPY, newAPY, isFetching, isSwapQuoteFetching ])
}


export default useStakeApy
