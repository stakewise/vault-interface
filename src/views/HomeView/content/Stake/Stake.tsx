import React from 'react'

import { Form } from 'components'

import StakeInfo from './StakeInfo/StakeInfo'
import StakeInput from './StakeInput/StakeInput'
import SubmitButton from './SubmitButton/SubmitButton'


const Stake: React.FC = () => (
  <Form className="mt-20">
    <StakeInput />
    <SubmitButton className="mt-8" />
    <StakeInfo className="mt-8" />
  </Form>
)


export default React.memo(Stake)
