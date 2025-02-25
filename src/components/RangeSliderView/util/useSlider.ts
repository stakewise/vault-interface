import { useEffect, useRef, RefObject, useState } from 'react'


type Input = {
  min: number
  max: number
  step: number
  setValue: (value: number) => void
}

type Output = {
  trackRef: RefObject<HTMLDivElement>
  thumbRef: RefObject<HTMLDivElement>
  isGrabbing: boolean
}

const useSlider = (props: Input): Output => {
  const { min, max, step, setValue } = props

  const [ isGrabbing, setIsGrabbing ] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const setValueRef = useRef(setValue)

  useEffect(() => {
    const getValue = (ratio: number) => {
      const range = max - min
      const finalRatio = Math.max(min, Math.min(max, ratio))
      const newValue = finalRatio * range + min
      const value = Math.round(newValue / step) * step

      return Number(value.toPrecision(5))
    }

    const handleDrag = (event: MouseEvent | TouchEvent) => {
      event.preventDefault()

      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
      const trackRect = trackRef.current?.getBoundingClientRect()
      const trackLeft = trackRect?.left || 0
      const trackWidth = trackRect?.width || 0
      const position = Math.min(
        Math.max(clientX - trackLeft, 0),
        trackWidth
      )
      const ratio = position / trackWidth
      const value = getValue(ratio)

      setValueRef.current(value)
    }

    const handleDragEnd = () => {
      setIsGrabbing(false)
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('touchmove', handleDrag)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
    }

    const handleDragStart = () => {
      setIsGrabbing(true)
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('touchmove', handleDrag)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('touchend', handleDragEnd)
    }

    const handleTrackClick = (event: MouseEvent) => {
      const trackRect = trackRef.current?.getBoundingClientRect()
      const clickPosition = event.clientX - (trackRect?.left || 0)
      const ratio = clickPosition / (trackRect?.width || 1)
      const value = getValue(ratio)

      setValueRef.current(value)
    }

    if (thumbRef.current) {
      thumbRef.current.addEventListener('mousedown', handleDragStart)
      thumbRef.current.addEventListener('touchstart', handleDragStart)
    }

    if (trackRef.current) {
      trackRef.current.addEventListener('click', handleTrackClick)
    }

    return () => {
      if (thumbRef.current) {
        thumbRef.current.removeEventListener('mousedown', handleDragStart)
        thumbRef.current.removeEventListener('touchstart', handleDragStart)
      }

      if (trackRef.current) {
        trackRef.current.removeEventListener('click', handleTrackClick)
      }

      handleDragEnd()
    }
  }, [ min, max, step ])

  return {
    trackRef,
    thumbRef,
    isGrabbing,
  }
}


export default useSlider
