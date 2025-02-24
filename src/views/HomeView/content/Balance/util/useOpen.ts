import { useState, useCallback, useMemo } from 'react'


enum Types {
  ExitQueue = 'exitQueu',
  UnboostQueue = 'unboostQueue'
}

const useOpen = () => {
  const [ openId, setOpen ] = useState<null | Types>(null)

  const openExitQueue = useCallback(() => {
    setOpen((value) => value === Types.ExitQueue
      ? null
      : Types.ExitQueue
    )
  }, [])

  const openUnboostQueue = useCallback(() => {
    setOpen((value) => value === Types.UnboostQueue
      ? null
      : Types.UnboostQueue
    )
  }, [])

  return useMemo(() => ({
    exitQueue: {
      isOpen: openId === Types.ExitQueue,
      handleOpen: openExitQueue,
    },
    unboostQueue: {
      isOpen: openId === Types.UnboostQueue,
      handleOpen: openUnboostQueue,
    },
  }), [
    openId,
    openExitQueue,
    openUnboostQueue,
  ])
}


export default useOpen
