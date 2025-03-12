import { useCallback, useMemo, useState } from 'react'


type Input = {
  skip?: boolean
}

const useShowLegend = (values: Input) => {
  const { skip } = values

  const [ isShowLegend, setShowLegend ] = useState(skip)

  const showLegend = useCallback(() => {
    if (skip) {
      return
    }

    setShowLegend(true)
  }, [ skip ])

  const hideLegend = useCallback(() => {
    if (skip) {
      return
    }

    setShowLegend(false)
  }, [ skip ])

  return useMemo(() => ({
    isShowLegend,
    showLegend,
    hideLegend,
  }), [
    isShowLegend,
    showLegend,
    hideLegend,
  ])
}


export default useShowLegend
