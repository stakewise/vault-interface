import React from 'react'

import { Form } from 'components'

import UnboostInput from './UnboostInput/UnboostInput'
import UnboostContent from './UnboostContent/UnboostContent'


const Unboost: React.FC = () => (
  <Form className="mt-20">
    <UnboostInput />
    <UnboostContent className="mt-8" />
  </Form>
)


export default React.memo(Unboost)
