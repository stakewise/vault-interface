import React from 'react'

import { Form } from 'components'

import BurnInfo from './BurnInfo/BurnInfo'
import BurnInput from './BurnInput/BurnInput'
import SubmitButton from './SubmitButton/SubmitButton'


const Burn: React.FC = () => (
  <Form className="mt-20">
    <BurnInput />
    <SubmitButton className="mt-8" />
    <BurnInfo className="mt-8" />
  </Form>
)


export default React.memo(Burn)
