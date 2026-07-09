import React from 'react'

import Token from '../Token/Token'
import TokenAmountInputView, { TokenAmountInputViewProps } from '../TokenAmountInputView/TokenAmountInputView'


export type TokenAmountInputProps = Omit<TokenAmountInputViewProps, 'tokenNode'>

const TokenAmountInput: React.FC<TokenAmountInputProps> = (props) => {
  const {
    className,
    label,
    field,
    balance,
    disabled,
    dataTestId,
    bottomNode,
    onChange,
    onMaxButtonClick,
  } = props

  const isEmptyBalance = typeof balance.value === 'undefined'

  return (
    <TokenAmountInputView
      className={className}
      label={label}
      field={field}
      disabled={disabled}
      balance={balance}
      dataTestId={dataTestId}
      bottomNode={bottomNode}
      tokenNode={(
        <Token
          className="flex-shrink-0"
          dataTestId={`${dataTestId}-token`}
          token={balance.token}
        />
      )}
      onChange={onChange}
      onMaxButtonClick={isEmptyBalance ? undefined : onMaxButtonClick}
    />
  )
}


export default React.memo(TokenAmountInput)
