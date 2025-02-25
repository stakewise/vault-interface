import { useCallback, useState } from 'react'
import { useEventListener } from 'sw-hooks'


type Input = {
  min: number
  max: number
  step: number
  value: number
  setValue: (value: number) => void
}

const useFocus = (props: Input) => {
  const { min, max, step, value, setValue } = props

  const [ isFocused, setFocused ] = useState(false)

  const handleKeydown = useCallback((event: any) => {
    if (isFocused) {
      const { key } = event

      const isArrowLeft = key === 'ArrowLeft'
      const isArrowRight = key === 'ArrowRight'

      if (isArrowLeft) {
        const newValue = Math.max(value - step, min)
        setValue(newValue)
      }
      if (isArrowRight) {
        const newValue = Math.min(value + step, max)
        setValue(newValue)
      }
    }
  }, [ min, max, step, value, isFocused, setValue ])

  useEventListener('keydown', handleKeydown)

  const onBlur = useCallback(() => setFocused(false), [])
  const onFocus = useCallback(() => setFocused(true), [])

  return {
    onBlur,
    onFocus,
  }
}


export default useFocus
