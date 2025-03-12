import React from 'react'

import { Form } from 'components'

import MintInfo from './MintInfo/MintInfo'
import MintInput from './MintInput/MintInput'
import SubmitButton from './SubmitButton/SubmitButton'


const Mint: React.FC = () => (
  <Form className="mt-20">
    <MintInput />
    <SubmitButton className="mt-8" />
    <MintInfo className="mt-8" />
  </Form>
)


export default React.memo(Mint)
