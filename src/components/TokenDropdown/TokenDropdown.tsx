import React, { useCallback } from 'react'
import cx from 'classnames'
import { Network } from 'sdk'
import { useConfig } from 'config'
import forms from 'modules/forms'
import device from 'modules/device'

import Icon from '../Icon/Icon'
import ButtonBase from '../ButtonBase/ButtonBase'
import DropdownView, { DropdownViewProps } from '../Dropdown/DropdownView/DropdownView'

import TokenBase from './TokenBase/TokenBase'
import TokenOptions from './TokenOptions/TokenOptions'
import { useTokenDropdown } from './util'


export type TokenDropdownProps = Omit<DropdownViewProps, 'children' | 'button' | 'options'> & {
  className?: string
  contentClassName?: string
  value: Tokens
  tokens: SwapToken[]
  isDisabled?: boolean
  isFetchingDisabled?: boolean
  onChange?: (value: string) => void
}

const TokenDropdown: React.FC<TokenDropdownProps> = (props) => {
  const {
    className, contentClassName, value, tokens, dataTestId = '', isDisabled, isFetchingDisabled,
    onChange, ...rest
  } = props

  const { chainId } = useConfig()
  const { isMobile } = device.useData()
  const { isFetching, open } = useTokenDropdown({
    isFetchingDisabled,
  })

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

  const isSwapEnabled = [ Network.Mainnet, Network.Gnosis ].includes(chainId)

  const tokenBaseNode = (
    <TokenBase
      className="flex-shrink-0"
      token={value}
      dataTestId={`${dataTestId}-token`}
    />
  )

  if (!isSwapEnabled) {
    return tokenBaseNode
  }

  return (
    <DropdownView
      className={cx(className, {
        'opacity-50': isDisabled,
      })}
      contentClassName={contentClassName}
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
      button={({ isOpen }) => (
        <ButtonBase
          className="flex items-center gap-8"
          disabled={isDisabled}
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
      onOpen={() => open(true)}
      onClose={() => {
        field.reset()
        open(false)
      }}
      onChange={handleChange}
      {...rest}
    >
      <TokenOptions
        field={field}
        tokens={tokens}
        isFetching={isFetching}
        dataTestId={dataTestId}
      />
    </DropdownView>
  )
}


export default React.memo(TokenDropdown)
