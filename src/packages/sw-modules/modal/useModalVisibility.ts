import { useState, useEffect } from 'react'

import { subscribe, unsubscribe } from './manager'


type State<Props> = {
  isVisible: boolean
  props?: Props
}

const useModalVisibility = <Props extends {}>(modalName: string): State<Props> => {
  const [ state, setState ] = useState<State<Props>>({ isVisible: false, props: undefined })

  useEffect(() => {
    const handler = (isVisible: boolean, props?: Props) => {
      setState({ isVisible, props })
    }

    subscribe<Props>(modalName, handler)

    return () => {
      unsubscribe<Props>(modalName, handler)
      setState({ isVisible: false, props: undefined })
    }
  }, [ modalName ])

  return state
}


export default useModalVisibility
