import { useMemo, useState } from 'react'
import { swapHooks } from 'hooks'


type Input = {
  isFetchingDisabled?: boolean
}

const useTokenDropdown = ({ isFetchingDisabled }: Input) => {
  const [ isOpen, setOpen ] = useState(false)

  const { isFetching } = swapHooks.useData({
    skip: !isOpen || isFetchingDisabled,
  })

  return useMemo(() => ({
    isFetching,
    open: setOpen,
  }), [
    isFetching,
    setOpen,
  ])
}


export default useTokenDropdown
