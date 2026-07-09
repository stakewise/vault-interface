import React from 'react'
import cx from 'classnames'
import intl from 'modules/intl'
import { methods } from 'helpers'

import { constants, replaceReactComponents } from '../../helpers'


const sizesMap = {
  text: [ 'lg', 'md', 'sm', 'xs' ],
  headers: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
} as const

export const sizes = [
  ...sizesMap.headers,
  ...sizesMap.text,
] as const

export type TextSize = typeof sizes[number]

export type TextColor = typeof constants.colors[number]

export type TextProps = {
  id?: string
  tag?: string
  size: TextSize
  html?: boolean
  htmlFor?: string
  className?: string
  dataTestId?: string
  children?: React.ReactNode
  color: TextColor | 'inherit'
  HrefComponent?: React.FC<any>
  message: Intl.Message | string
  CustomComponent?: React.FC<any>
  ref?: React.RefObject<HTMLElement | null>
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const Text: React.FC<TextProps> = (props) => {
  const {
    children, className, id, tag = 'div',
    message, size, color, html, ref,
    htmlFor, dataTestId,
    HrefComponent,
    CustomComponent,
    onClick, ...otherProps
  } = props

  const intlControls = intl.useIntl()

  if (onClick && tag !== 'button') {
    throw new Error('You can\'t use "onClick" without passing tag === "button". Create components ADA friendly!')
  }

  const rootClassName = cx(className, {
    // New sizes
    'text-h1': size === 'h1',
    'text-h2': size === 'h2',
    'text-h3': size === 'h3',
    'text-h4': size === 'h4',
    'text-h5': size === 'h5',
    'text-h6': size === 'h6',
    'font-heading': sizesMap.headers.includes(size as typeof sizesMap.headers[number]),

    'text-lg': size === 'lg',
    'text-md': size === 'md',
    'text-sm': size === 'sm',
    'text-xs': size === 'xs',

    'text-light': color === 'light',
    'text-dark': color === 'dark',
    'text-black': color === 'black',
    'text-white': color === 'white',
    'text-primary': color === 'primary',
    'text-secondary': color === 'secondary',
    'text-warning': color === 'warning',
    'text-success-light': color === 'success-light',
    'text-success': color === 'success',
    'text-error': color === 'error',
  })

  const htmlAttrs = methods.getGlobalHtmlAttrs(otherProps)

  let content = children

  if (message) {
    if (typeof message === 'string') {
      content = message
    }
    else {
      const { values, ...intlMessage } = message || {}

      content = intlControls.formatMessage(intlMessage, values)
    }
  }

  const htmlProps = {
    ...htmlAttrs,
    ref,
    id,
    htmlFor,
    onClick,
    className: rootClassName,
    'data-testid': dataTestId,
  }

  if (html) {
    const componentsMap = {
      CustomComponent,
      Href: HrefComponent,
    }

    for (const [ componentName, Component ] of Object.entries(componentsMap)) {
      if (new RegExp(`<${componentName}`).test(content as string) && Component) {
        const children = replaceReactComponents(content as string, { [componentName]: Component })
          .map((child, index) =>
            typeof child === 'string' ? child : { ...child, key: child.key || index }
          )

        return React.createElement(tag, htmlProps, children)
      }
    }

    if (/<a /.test(content as string)) {
      console.error('Please use <Href> instead of <a> in messages')
    }

    return React.createElement(tag, {
      ...htmlProps,
      dangerouslySetInnerHTML: {
        __html: content,
      },
    })
  }

  return React.createElement(tag, htmlProps, content)
}

Text.displayName = 'Text'


export default React.memo(Text)
