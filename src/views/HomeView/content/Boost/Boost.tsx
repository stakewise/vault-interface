import React from 'react'

import { Form } from 'components'

import BoostInput from './BoostInput/BoostInput'
import BoostContent from './BoostContent/BoostContent'


const Boost: React.FC = () => (
  <Form className="mt-20">
    <BoostInput />
    <BoostContent className="mt-8" />
  </Form>
)


export default React.memo(Boost)
