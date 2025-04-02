import React, { useContext } from 'react'


const initContext = <T extends unknown, A = undefined>(
  initialContext: T,
  logic: (props: A) => T
) => {
  const Context = React.createContext<T>(initialContext)
  const Provider = Context.Provider

  const useData = () => useContext<T>(Context)
  const useInit = (props?: A): T => logic(props as A)

  return { Provider, useData, useInit }
}


export default initContext
