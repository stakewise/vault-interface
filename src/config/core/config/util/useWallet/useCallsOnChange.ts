import { useCallback, useRef, useMemo } from 'react'
import EventAggregator from 'modules/event-aggregator'


const types = {
  chain: 'chain',
  address: 'address',
}

type Type = keyof typeof types
type Handler = Parameters<EventAggregator['subscribe']>[1]
export type Subscription = (type: Type, handler: Handler) => void

const useCallsOnChange = () => {
  const eventsRef = useRef(new EventAggregator())

  const subscribeBeforeChange = useCallback<Subscription>((type: Type, handler: Handler) => {
    eventsRef.current.subscribe(type, handler)
  }, [])

  const unsubscribeBeforeChange = useCallback<Subscription>((type: Type, handler: Handler) => {
    eventsRef.current.unsubscribe(type, handler)
  }, [])

  const onChangeChain = useCallback(() => {
    eventsRef.current.dispatch(types.chain)
  }, [])

  const onChangeAddress = useCallback(() => {
    eventsRef.current.dispatch(types.address)
  }, [])

  return useMemo(() => ({
    onChangeChain,
    onChangeAddress,
    subscribeBeforeChange,
    unsubscribeBeforeChange,
  }), [
    onChangeChain,
    onChangeAddress,
    subscribeBeforeChange,
    unsubscribeBeforeChange,
  ])
}


export default useCallsOnChange
