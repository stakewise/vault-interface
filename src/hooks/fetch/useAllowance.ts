import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useConfig } from 'config'
import { ZeroAddress } from 'ethers'

import { commonMessages } from 'helpers'
import notifications from 'modules/notifications'

import useObjectState from '../controls/useObjectState'
import useTransaction from './useTransaction'


type State = {
  allowance: bigint
  isFetching: boolean
}

const initialState: State = {
  allowance: 0n,
  isFetching: false,
}

export type CheckAllowanceInput = {
  allowance: bigint
  count?: number
  hash?: string
}

type Input = {
  recipient: string
  tokenAddress: string
  skip?: boolean
}

const useAllowance = (values: Input) => {
  const { recipient, tokenAddress } = values

  const { sdk, address } = useConfig()

  const skip = values.skip || !address || recipient === ZeroAddress

  const handleTransaction = useTransaction()

  const [ { allowance, isFetching }, setState ] = useObjectState<State>({
    allowance: initialState.allowance,
    isFetching: !skip,
  })

  const allowanceRef = useRef(allowance)
  allowanceRef.current = allowance

  const fetchAllowance = useCallback(async () => {
    if (!address || recipient === ZeroAddress) {
      return allowanceRef.current
    }

    try {
      const tokenContract = sdk.contracts.helpers.createErc20(tokenAddress)
      const allowance = await tokenContract.allowance(address, recipient)

      setState({
        allowance,
        isFetching: false,
      })

      return allowance
    }
    catch (error) {
      console.error('UseAllowance: can\'t fetch allowance', error as Error)

      setState({ isFetching: false })

      notifications.open({
        text: commonMessages.notification.somethingWentWrong,
        type: 'error',
      })

      return allowanceRef.current
    }
  }, [ sdk, address, tokenAddress, recipient, setState ])

  useEffect(() => {
    if (skip) {
      setState(initialState)

      return () => {
        setState({ isFetching: true })
      }
    }
    else {
      fetchAllowance()
    }
  }, [ skip, fetchAllowance, setState ])

  const checkAllowance = useCallback(async ({ allowance, hash, count = 0 }: CheckAllowanceInput) => {
    if (hash) {
      await handleTransaction(hash)
    }

    const newAllowance = await fetchAllowance()

    if (allowance === newAllowance) {
      if (count < 20) {
        await new Promise((resolve) => setTimeout(resolve, 250 * count))

        return checkAllowance({ allowance, count: count + 1 })
      }
      else {
        return Promise.reject('The allowance has not changed')
      }
    }
  }, [ fetchAllowance, handleTransaction ])

  return useMemo(() => ({
    allowance,
    isFetching,
    checkAllowance,
  }), [
    allowance,
    isFetching,
    checkAllowance,
  ])
}


export default useAllowance
