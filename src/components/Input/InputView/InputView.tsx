import React, { useState, useCallback, useRef, useId, useEffect, ChangeEventHandler } from 'react'
import cx from 'classnames'
import methods from 'sw-methods'

import Text from '../../Text/Text'
import Icon from '../../Icon/Icon'
import Logo from '../../Logo/Logo'
import ButtonBase from '../../ButtonBase/ButtonBase'

import InputButton from '../InputButton/InputButton'

import s from './InputView.module.scss'
import messages from './messages'


type ViewProps = {
  value: string | undefined
  error?: Intl.Message | string | null | boolean
  isRequired?: boolean
  onCrossClick?: () => void
}

export type InputViewProps = ViewProps & {
  className?: string
  elementClassName?: string
  description?: Intl.Message | string
  label?: Intl.Message | string
  disabled?: boolean
  multiline?: number
  token?: Tokens
  secondaryButtonTitle?: Intl.Message | string
  autoFocus?: boolean
  dataTestId?: string
  buttonTitle?: Intl.Message | string
  onButtonClick?: () => void
  onSecondaryButtonClick?: () => void
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

const InputView: React.FC<InputViewProps> = (props) => {
  const {
    className, value, error, label, autoFocus, description, secondaryButtonTitle,
    token, disabled, isRequired, dataTestId, multiline, buttonTitle, elementClassName,

    onButtonClick, onSecondaryButtonClick, onCrossClick, onChange, onBlur, onFocus, ...otherProps
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [ isFocused, setFocused ] = useState(Boolean(autoFocus))

  const isTextArea = Boolean(multiline)
  const ref = isTextArea ? textAreaRef : inputRef

  const handleButtonClick = useCallback((event: any) => {
    event.stopPropagation()

    if (typeof onButtonClick === 'function') {
      onButtonClick()
    }
  }, [ onButtonClick ])

  const handleSecondaryButtonClick = useCallback((event: any) => {
    event.stopPropagation()

    if (typeof onSecondaryButtonClick === 'function') {
      onSecondaryButtonClick()
    }
  }, [ onSecondaryButtonClick ])

  useEffect(() => {
    if (autoFocus) {
      setFocused(true)
    }
  }, [ autoFocus ])

  const handleBlur = useCallback(() => {
    if (typeof onBlur === 'function') {
      onBlur()
    }

    setFocused(false)
  }, [ onBlur ])

  const handleFocus = useCallback(() => {
    if (typeof onFocus === 'function') {
      onFocus()
    }

    setFocused(true)
  }, [ onFocus ])

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>((event) => {
    const value = event.target.value

    if (typeof onChange === 'function') {
      onChange(value)
    }
  }, [ onChange ])

  useEffect(() => {
    if (isFocused && !disabled && ref.current) {
      ref.current.focus()
    }
  }, [ isFocused, disabled ])

  const controlId = useId()
  const htmlAttrs = methods.getGlobalHtmlAttrs(otherProps)
  const disableCrossClick = useRef(false)
  const testId = dataTestId || `input-${controlId}`

  const isError = Boolean(error)
  const isFilled = value !== undefined && value !== ''
  const isShowTooltip = isError && isFocused && typeof error !== 'boolean'

  const containerClassName = cx(s.container, 'w-full flex items-center rounded-8', {
    [s.focused]: isFocused && !disabled,
    [s.filled]: isFilled,
    [s.error]: isError && !isFocused,
    [s.disabled]: disabled,
    [s.isMultiline]: multiline,
    'px-16': !multiline && !token,
    'pl-8 pr-16': token,
    'pl-16': multiline,
    'opacity-50 cursor-default': disabled,
  })

  const inputClassName = cx(
    s.field,
    elementClassName,
    'w-full text-t14m overflow-ellipsis whitespace-nowrap text-dark',
    {
      'mt-16': Boolean(label),
      'cursor-default': disabled,
    }
  )

  const textareaClassName = cx(
    s.field,
    s.isMultiline,
    elementClassName,
    'w-full mb-8 pb-8 pr-32 text-t14m text-dark scroll-y',
    {
      'mt-24': Boolean(label),
      'cursor-default': disabled,
    }
  )

  const elementProps = {
    ...htmlAttrs,
    ref,
    disabled,
    id: controlId,
    value: value || '',
    'data-testid': testId,
    'aria-invalid': isError,
    'aria-required': isRequired,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onChange: handleChange,
    className: isTextArea ? textareaClassName : inputClassName,
    ...(isTextArea && {
      rows: multiline,
    }),
  }

  const handleCrossClick = useCallback(() => {
    if (typeof onCrossClick === 'function' && !disableCrossClick.current) {
      onCrossClick()
    }

    disableCrossClick.current = false
  }, [ onCrossClick ])

  return (
    <div className={cx(className, 'relative')}>
      <div
        className={containerClassName}
        onKeyDown={(event) => {
          // fix cross click instead of form submit
          disableCrossClick.current = event.key === 'Enter'
        }}
        onClick={disabled ? undefined : handleFocus}
      >
        {
          token && (
            <Logo
              className="mr-8"
              name={`token/${token}`}
              size={20}
            />
          )
        }
        <div className="w-full h-full inline-flex flex-col justify-center relative">
          {
            Boolean(label) && (
              <Text
                className={cx(s.label, 'absolute left-0 w-full overflow-ellipsis whitespace-nowrap opacity-60')}
                message={label as string}
                tag="label"
                size={(value || isFocused && !disabled) ? 't12' : 't14'}
                color="dark"
                htmlFor={controlId}
              />
            )
          }
          <div className="flex items-center">
            {
              React.createElement(
                isTextArea ? 'textarea' : 'input',
                elementProps
              )
            }
            {
              typeof onCrossClick === 'function' && isFilled && !disabled && (
                <ButtonBase
                  className={cx(s.crossButton, {
                    'ml-16': !multiline,
                    'absolute': multiline,
                  })}
                  ariaLabel={messages.resetValue}
                  dataTestId={`${testId}-close-button`}
                  onClick={handleCrossClick}
                >
                  <Icon
                    name="icon/close"
                    size={24}
                    color="dark"
                  />
                </ButtonBase>
              )
            }
            {
              Boolean(buttonTitle) && (
                <InputButton
                  className="ml-8"
                  disabled={disabled}
                  title={buttonTitle as string}
                  dataTestId={`${testId}-button`}
                  onClick={handleButtonClick}
                />
              )
            }
            {
              Boolean(secondaryButtonTitle) && (
                <InputButton
                  className="ml-8"
                  disabled={disabled}
                  dataTestId={`${testId}-secondary-button`}
                  title={secondaryButtonTitle as string}
                  onClick={handleSecondaryButtonClick}
                />
              )
            }
          </div>
        </div>
      </div>
      {
        Boolean(description) && (
          <Text
            className={cx(s.description, 'w-full mt-4')}
            size="t12"
            color="inherit"
            message={description as Intl.Message}
          />
        )
      }
      {
        isShowTooltip && (
          <div className="py-8 px-16 rounded-8 absolute left-0 bottom-full bg-black mb-4">
            <Text
              size="t14"
              color="white"
              message={error as Intl.Message}
              dataTestId={`${testId}-error`}
            />
          </div>
        )
      }
    </div>
  )
}


export default React.memo(InputView)
