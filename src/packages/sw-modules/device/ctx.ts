import { useEffect, useLayoutEffect, useState } from 'react'

import initContext from 'sw-helpers/initContext'


const initialContext: Device.Context = {
  isDesktop: true,
  isMobile: false,
  isCalculated: false,
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? useLayoutEffect
  : useEffect

const {
  Provider,
  useData,
  useInit,
} = initContext<Device.Context, Device.Input | undefined>(initialContext, (props) => {
  const { initialValue, onChange } = props || {}
  const [ deviceContext, setDeviceContext ] = useState<Device.Context>(initialValue || initialContext)

  useIsomorphicLayoutEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 999px)')
    const desktopMediaQuery = window.matchMedia('(min-width: 1000px)')

    const handleSetDevice = () => {
      const value = {
        isMobile: mobileMediaQuery.matches,
        isDesktop: desktopMediaQuery.matches,
        isCalculated: true,
      }

      setDeviceContext(value)

      if (typeof onChange === 'function') {
        onChange(value)
      }
    }

    handleSetDevice()

    desktopMediaQuery.addEventListener('change', handleSetDevice)

    return () => {
      desktopMediaQuery.removeEventListener('change', handleSetDevice)
    }
  }, [ onChange ])

  return deviceContext
})


export default {
  Provider,
  useData,
  useInit,
}
