import { useEffect, useLayoutEffect, useState } from 'react'

import initContext from 'helpers/initContext'


const initialContext: Device.Context = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
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
    const mobileMediaQuery = window.matchMedia('(max-width: 576px)')
    const tabletMediaQuery = window.matchMedia('(min-width: 577px) and (max-width: 999px)')
    const desktopMediaQuery = window.matchMedia('(min-width: 1000px)')

    const handleSetDevice = () => {
      const value = {
        isMobile: mobileMediaQuery.matches,
        isTablet: tabletMediaQuery.matches,
        isDesktop: desktopMediaQuery.matches,
        isCalculated: true,
      }

      setDeviceContext(value)

      if (typeof onChange === 'function') {
        onChange(value)
      }
    }

    handleSetDevice()

    tabletMediaQuery.addEventListener('change', handleSetDevice)
    desktopMediaQuery.addEventListener('change', handleSetDevice)

    return () => {
      tabletMediaQuery.removeEventListener('change', handleSetDevice)
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
