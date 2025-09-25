import React from 'react'

import { Form } from 'components'

import UnstakeContent from './UnstakeContent/UnstakeContent'
import UnstakeInput from './UnstakeInput/UnstakeInput'


const Unstake: React.FC = () => (
  <Form className="mt-20">
    <UnstakeInput />
    <UnstakeContent className="mt-8" />
  </Form>
)


export default React.memo(Unstake)
