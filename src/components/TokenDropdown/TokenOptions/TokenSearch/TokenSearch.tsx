import React from 'react'
import cx from 'classnames'
import intl from 'modules/intl'
import forms from 'modules/forms'

import Icon from '../../../Icon/Icon'
import RoundButton from '../../../RoundButton/RoundButton'

import messages from './messages'
import s from './TokenSearch.module.scss'


export type TokenSearchProps = {
  className?: string
  field: Forms.Field<string>
  dataTestId?: string
}

const TokenSearch: React.FC<TokenSearchProps> = (props) => {
  const { className, field, dataTestId } = props

  const { formatMessage } = intl.useIntl()
  const { value: search } = forms.useFieldValue(field)

  return (
    <div
      className={cx(className, 'flex justify-end items-center h-[44px] border-bottom border-dark/10')}
    >
      <Icon
        className="opacity-60 ml-16"
        name="icon/search"
        color="dark"
        size={16}
      />
      <input
        className={cx(s.input, 'pr-24 ml-12 h-full w-full')}
        type="text"
        value={search}
        data-testid={`${dataTestId}-input`}
        aria-label={formatMessage(messages.label)}
        onChange={(event) => field.setValue(event.target.value)}
      />
      <RoundButton
        className="absolute right-20"
        icon="icon/close"
        color="secondary"
        size={16}
        ariaLabel={messages.cancelSearch}
        onClick={() => field.setValue('')}
      />
    </div>
  )
}


export default React.memo(TokenSearch)
