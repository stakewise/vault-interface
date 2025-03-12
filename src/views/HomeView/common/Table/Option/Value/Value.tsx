import React from 'react'

import { Loading } from 'components'

import TextValue, { TextValueProps } from './TextValue/TextValue'
import TokenValue, { TokenValueProps } from './TokenValue/TokenValue'


export type ValueProps = {
  isFetching?: boolean
  textValue?: TextValueProps
  tokenValue?: TokenValueProps
}

const Value: React.FC<ValueProps> = (props) => {
  const { textValue, tokenValue, isFetching } = props

  if (isFetching) {
    return (
      <Loading size={16} />
    )
  }

  if (tokenValue) {
    return (
      <TokenValue {...tokenValue as TokenValueProps} />
    )
  }

  if (textValue) {
    return (
      <TextValue {...textValue as TextValueProps} />
    )
  }

  return null
}


export default React.memo(Value)
