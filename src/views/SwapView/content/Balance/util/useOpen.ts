import { useState, useCallback, useMemo } from 'react'


enum Types {
  UnstakeQueue = 'unstakeQueue',
  UnboostQueue = 'unboostQueue'
}

const useOpen = () => {
  const [ openId, setOpen ] = useState<null | Types>(null)

  const openUnstakeQueue = useCallback(() => {
    setOpen((value) => value === Types.UnstakeQueue
      ? null
      : Types.UnstakeQueue
    )
  }, [])

  const openUnboostQueue = useCallback(() => {
    setOpen((value) => value === Types.UnboostQueue
      ? null
      : Types.UnboostQueue
    )
  }, [])

  return useMemo(() => ({
    unstakeQueue: {
      isOpen: openId === Types.UnstakeQueue,
      handleOpen: openUnstakeQueue,
    },
    unboostQueue: {
      isOpen: openId === Types.UnboostQueue,
      handleOpen: openUnboostQueue,
    },
  }), [
    openId,
    openUnstakeQueue,
    openUnboostQueue,
  ])
}


export default useOpen
