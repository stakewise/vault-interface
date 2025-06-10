import React, { useCallback } from 'react'
import forms from 'modules/forms'
import device from 'modules/device'
import { useConfig } from 'config'

import Icon from '../Icon/Icon'
import ButtonBase from '../ButtonBase/ButtonBase'
import DropdownView, { DropdownViewProps } from '../Dropdown/DropdownView/DropdownView'

import TokenBase from './TokenBase/TokenBase'

import TokenOptions from './TokenOptions/TokenOptions'


export type TokenDropdownProps = Omit<DropdownViewProps, 'children' | 'button' | 'options'> & {
  className?: string
  value: Tokens
  tokens: SwapToken[]
  isFetching?: boolean
  onChange?: (value: string) => void
}

const TokenDropdown: React.FC<TokenDropdownProps> = (props) => {
  const { className, value, tokens, dataTestId, isFetching, onChange, ...rest } = props

  const { isMobile } = device.useData()
  const { isReadOnlyMode } = useConfig()

  const field = forms.useField<string>({
    valueType: 'string',
    initialValue: '',
  })

  const handleChange = useCallback((value: string) => {
    if (typeof onChange === 'function') {
      onChange(value)
    }

    field.setValue('')
  }, [ field, onChange ])

  const tokenBaseNode = (
    <TokenBase
      className="flex-shrink-0"
      token={value}
      dataTestId={`${dataTestId}-token`}
      isFetching={isFetching}
    />
  )

  if (isFetching || tokens.length < 2) {
    return tokenBaseNode
  }

  return (
    <DropdownView
      className={className}
      dataTestId={dataTestId}
      middleware={(
        isMobile
          ? {
            offsetOptions: {
              mainAxis: 26,
              crossAxis: 18,
            },
            flip: false,
            autoUpdate: false,
          }
          : undefined
      )}
      button={({ ref, isOpen }) => (
        <ButtonBase
          // @ts-ignore
          ref={ref}
          className="flex items-center gap-8"
          disabled={isReadOnlyMode}
        >
          {tokenBaseNode}
          <Icon
            className="flex-none"
            name={isOpen ? 'arrow/up' : 'arrow/down'}
            size={16}
            color="dark"
          />
        </ButtonBase>
      )}
      onOptionsKeyDown={(event) => {
        const isCombination = event.ctrlKey || event.metaKey

        if (event.key.length === 1 && !isCombination) {
          event.preventDefault()

          const input = event.target as HTMLInputElement
          const cursorPosition = input.selectionStart || 0
          const before = input.value.slice(0, cursorPosition)
          const after = input.value.slice(cursorPosition)

          field.setValue(`${before}${event.key}${after}`)

          setTimeout(() => {
            input.selectionStart = input.selectionEnd = cursorPosition + 1
          })
        }
      }}
      onClose={field.reset}
      onChange={handleChange}
      {...rest}
    >
      <TokenOptions
        field={field}
        tokens={tokens}
        dataTestId={dataTestId}
      />
    </DropdownView>
  )
}


export default React.memo(TokenDropdown)
