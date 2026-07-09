import React, { useCallback, useRef, useId, useEffect, ChangeEventHandler, MouseEventHandler, KeyboardEventHandler } from 'react'
import cx from 'classnames'
import { methods } from 'helpers'
import device from 'modules/device'
import { useObjectState } from 'hooks'
import { GlobalHtmlAttributes } from 'helpers/methods/getGlobalHtmlAttrs'

import Text from '../../Text/Text'
import Logo from '../../Logo/Logo'
import Icon, { IconProps } from '../../Icon/Icon'
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

export type InputViewProps = ViewProps & GlobalHtmlAttributes & {
  className?: string
  elementClassName?: string
  description?: Intl.Message | string
  label?: Intl.Message | string
  icon?: IconProps['name']
  rightIcon?: IconProps['name']
  placeholder?: Intl.Message | string
  disabled?: boolean
  isButtonDisabled?: boolean
  multiline?: number
  token?: Tokens
  autoFocus?: boolean
  dataTestId?: string
  isCustomFocus?: boolean
  buttonTitle?: Intl.Message | string
  validateOn?: 'change' | 'blur'
  onBlur?: () => void
  onFocus?: () => void
  onEnter?: () => void
  onChange?: (value: string) => void
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  onButtonClick?: () => void
}

const InputView: React.FC<InputViewProps> = (props) => {
  const {
    className, value, error, label, icon, rightIcon, autoFocus, description, isButtonDisabled = false, placeholder, isCustomFocus,
    token, disabled, isRequired, dataTestId, multiline, buttonTitle, elementClassName, validateOn = 'change',

    onButtonClick, onCrossClick, onChange, onBlur, onFocus, onEnter, onKeyDown, ...otherProps
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [ { isFocused, isTouched }, setState ] = useObjectState({
    isFocused: Boolean(autoFocus),
    isTouched: false,
  })

  const isTextArea = Boolean(multiline)
  const ref = isTextArea ? textAreaRef : inputRef

  const { isMobile } = device.useData()

  const handleButtonClick = useCallback((event: any) => {
    event.stopPropagation()

    if (typeof onButtonClick === 'function') {
      onButtonClick()
    }
  }, [ onButtonClick ])

  useEffect(() => {
    if (autoFocus) {
      setState({ isFocused: true })
    }
  }, [ autoFocus, setState ])

  const handleBlur = useCallback(() => {
    if (typeof onBlur === 'function') {
      onBlur()
    }

    setState({ isFocused: false, isTouched: true })
  }, [ onBlur, setState ])

  const handleFocus = useCallback(() => {
    if (typeof onFocus === 'function') {
      onFocus()
    }

    setState({ isFocused: true })
  }, [ onFocus, setState ])

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>((event) => {
    const value = event.target.value

    if (typeof onChange === 'function') {
      onChange(value)
    }
  }, [ onChange ])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof onKeyDown === 'function') {
      onKeyDown(event)
    }

    if (typeof onEnter === 'function' && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onEnter()
    }
  }, [ onEnter, onKeyDown ])

  useEffect(() => {
    if (isFocused && !disabled && ref.current) {
      const length = ref.current.value?.length || 0
      const element = ref.current

      element.focus()

      // setSelectionRange is supported only for textareas and text-like input types
      const isTextarea = element instanceof HTMLTextAreaElement
      const isTextLikeInput = !isTextarea && [ 'text', 'search', 'url', 'tel', 'password' ].includes(element.type)

      if (isTextarea || isTextLikeInput) {
        element.setSelectionRange(length, length)
      }
    }
  }, [ ref, isFocused, disabled ])

  const controlId = useId()
  const htmlAttrs = methods.getGlobalHtmlAttrs(otherProps)
  const disableCrossClick = useRef(false)
  const testId = dataTestId || `input-${controlId}`

  const isError = Boolean(error) && (validateOn !== 'blur' || isTouched)
  const isFilled = value !== undefined && value !== ''
  const isShowTooltip = isError && isFocused && typeof error !== 'boolean'

  const containerClassName = cx(s.container, 'w-full flex items-center rounded-8', {
    [s.focused]: isFocused && !disabled,
    [s.isCustomFocus]: isFocused && !disabled && isCustomFocus,
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
    'w-full text-sm font-medium overflow-ellipsis whitespace-nowrap text-moon flex-1',
    {
      'mt-16': Boolean(label),
      'cursor-default': disabled,
    }
  )

  const textareaClassName = cx(
    s.field,
    s.isMultiline,
    elementClassName,
    'w-full mb-8 pb-8 pr-36 font-medium text-dark scroll-y',
    {
      'text-md': isMobile,
      'text-sm': !isMobile,
      'mt-24': Boolean(label),
      'mt-12': Boolean(placeholder),
      'cursor-default': disabled,
    }
  )

  const tooltipClassName = `
    py-4 px-8 mb-8 rounded-8 absolute left-0 bottom-full
    bg-white backdrop-blur-[30px] border border-coal/20 shadow-md
  `

  const elementProps = {
    ...htmlAttrs,
    ref,
    disabled,
    placeholder,
    id: controlId,
    value: value || '',
    'data-testid': testId,
    'aria-invalid': isError,
    'aria-required': isRequired,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    className: isTextArea ? textareaClassName : inputClassName,
    ...(isTextArea && {
      rows: multiline,
    }),
  }

  const handleCrossClick = useCallback((event?: Parameters<MouseEventHandler>[0]) => {
    event?.stopPropagation()

    if (typeof onCrossClick === 'function' && !disableCrossClick.current) {
      onCrossClick()
    }

    disableCrossClick.current = false
  }, [ onCrossClick ])

  const isCrossButtonShown = typeof onCrossClick === 'function' && isFilled && !disabled

  return (
    <div className={cx(className, 'relative')}>
      <div
        className={containerClassName}
        onKeyDown={(event) => {
          event.stopPropagation()
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
        {
          icon && (
            <Icon
              className="mr-8"
              name={icon}
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
                size={(value || isFocused && !disabled) ? 'xs' : 'sm'}
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
              isCrossButtonShown && (
                <ButtonBase
                  className={cx(s.crossButton, {
                    'ml-16': !multiline,
                    'absolute': multiline,
                  })}
                  ariaLabel={messages.resetValue}
                  dataTestId={`${testId}-cross-button`}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()

                      disableCrossClick.current = false
                      handleCrossClick()
                      ref.current?.focus()
                    }
                  }}
                  onClick={handleCrossClick}
                >
                  <Icon
                    name="icon/close"
                    size={16}
                    color="dark"
                  />
                </ButtonBase>
              )
            }
            {
              Boolean(buttonTitle) && (
                <InputButton
                  className="ml-8 flex-col"
                  title={buttonTitle as string}
                  dataTestId={`${testId}-button`}
                  disabled={isButtonDisabled || disabled}
                  onClick={handleButtonClick}
                />
              )
            }
            {
              (!isCrossButtonShown && rightIcon) && (
                <Icon
                  className="opacity-70"
                  name={rightIcon}
                  size={20}
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
            html
            size="xs"
            color="inherit"
            message={description as Intl.Message}
          />
        )
      }
      {
        isShowTooltip && (
          <div className={tooltipClassName}>
            <Text
              size="sm"
              color={error ? 'error' : 'dark'}
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
