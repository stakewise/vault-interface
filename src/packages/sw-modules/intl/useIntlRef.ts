import { useRef } from 'react'

import useIntl from './useIntl'


const useIntlRef = () => {
  const intlControls = useIntl()

  const intlRef = useRef(intlControls)
  intlRef.current = intlControls

  return intlRef
}


export default useIntlRef
