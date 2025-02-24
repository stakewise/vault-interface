import React from 'react'

import { Form } from 'components'

import UnstakeContent from './UnstakeContent/UnstakeContent'
import UnstakeInput from './UnstakeInput/UnstakeInput'


const Unstake: React.FC = () => (
  <div className="mt-20">
    <Form>
      <UnstakeInput />
      <UnstakeContent className="mt-8" />
    </Form>
  </div>
)


export default React.memo(Unstake)
