import { useEffect, useRef } from 'react'
import Onboarding from '@metamask/onboarding'


const useMetaMaskOnboarding = () => {
  const onboarding = useRef<Onboarding>()

  useEffect(() => {
    onboarding.current = new Onboarding()
  }, [])

  return onboarding
}


export default useMetaMaskOnboarding
