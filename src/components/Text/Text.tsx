import React from 'react'
import cx from 'classnames'
import methods from 'helpers/methods'
import intl from 'modules/intl'

import { constants, replaceReactComponents } from '../../helpers'


const sizesMap = {
  text: [ 't20b', 't18m', 't18b', 't16m', 't16b', 't14', 't14m', 't14b', 't12', 't12m', 't12b' ],
  notes: [ 'n10', 'n10m', 'n10b' ],
  headers: [ 'h100', 'h90', 'h60', 'h48', 'h40', 'h32', 'h24', 'h22', 'h20' ],
} as const

export const sizes = [
  ...sizesMap.headers,
  ...sizesMap.text,
  ...sizesMap.notes,
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
    'text-h100': size === 'h100',
    'text-h90': size === 'h90',
    'text-h60': size === 'h60',
    'text-h48': size === 'h48',
    'text-h40': size === 'h40',
    'text-h32': size === 'h32',
    'text-h24': size === 'h24',
    'text-h22': size === 'h22',
    'text-h20': size === 'h20',
    'text-t20b': size === 't20b',
    'text-t18m': size === 't18m',
    'text-t18b': size === 't18b',
    'text-t16m': size === 't16m',
    'text-t16b': size === 't16b',
    'text-t14': size === 't14',
    'text-t14m': size === 't14m',
    'text-t14b': size === 't14b',
    'text-t12': size === 't12',
    'text-t12m': size === 't12m',
    'text-t12b': size === 't12b',
    'text-n10': size === 'n10',
    'text-n10m': size === 'n10m',
    'text-n10b': size === 'n10b',

    'text-light': color === 'light',
    'text-dark': color === 'dark',
    'text-black': color === 'black',
    'text-white': color === 'white',
    'text-primary': color === 'primary',
    'text-secondary': color === 'secondary',
    'text-smoke': color === 'smoke',
    'text-warning': color === 'warning',
    'text-success-light': color === 'success-light',
    'text-success': color === 'success',
    'text-error': color === 'error',
    'text-titanium': color === 'titanium',
    'text-dark-opacity': color === 'dark-opacity',
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
