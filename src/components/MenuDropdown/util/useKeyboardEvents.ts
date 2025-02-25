import { KeyboardEventHandler, useCallback, useMemo, useState } from 'react'

import type { DropdownOption } from '../OptionList/OptionList'


type Input = {
  options: DropdownOption[]
  parentOption: DropdownOption | null
  setParentOptionValue: (value: string | null) => void
}

const useKeyboardEvents = ({ options, parentOption, setParentOptionValue }: Input) => {
  const [ activeOption, setActiveOption ] = useState<number | null>(null)

  const handleClick = useCallback(() => {
    setActiveOption(null)
  }, [])

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>((event) => {
    if (parentOption) {
      const isExit = event.key === 'Escape' || event.key === 'ArrowLeft'

      if (isExit) {
        event.preventDefault()
        setParentOptionValue(null)
      }
    }
    else if (options?.[0].options?.length) {
      const isUp = event.key === 'ArrowUp'
      const isDown = event.key === 'ArrowDown'
      const isEnter = event.key === 'Enter' || event.key === 'ArrowRight'

      if (isEnter) {
        event.preventDefault()

        setActiveOption((activeOption) => {
          if (activeOption !== null) {
            setParentOptionValue(options[activeOption].value)
          }

          return activeOption
        })
      }
      else if (isUp || isDown) {
        setActiveOption((activeOption) => {
          if (activeOption === null) {
            return isUp ? options.length -1 : 0
          }

          const nextIndex = isUp ? activeOption - 1 : activeOption + 1

          if (nextIndex >= 0 && nextIndex < options.length) {
            return nextIndex
          }

          return activeOption
        })
      }
    }
  }, [ options, parentOption, setParentOptionValue ])

  return useMemo(() => ({
    activeOption,
    handleClick,
    handleKeyDown,
  }), [
    activeOption,
    handleClick,
    handleKeyDown,
  ])
}


export default useKeyboardEvents
