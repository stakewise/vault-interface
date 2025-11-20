import React, { useEffect } from 'react'

import { Form } from 'components'
import { swapCtx } from 'views/SwapView/util'

import UnboostInput from './UnboostInput/UnboostInput'
import UnboostContent from './UnboostContent/UnboostContent'


const Unboost: React.FC = () => {
  const { unboost } = swapCtx.useData()

  useEffect(() => {
    return () => {
      unboost.percentField.reset()
    }
  }, [])

  return (
    <Form className="mt-20">
      <UnboostInput />
      <UnboostContent className="mt-8" />
    </Form>
  )
}


export default React.memo(Unboost)
