import React from 'react'
import cx from 'classnames'
import methods from 'sw-methods'
import intl from 'sw-modules/intl'

import { replaceReactComponents } from 'sw-components'

import { constants } from '../../helpers'


const sizesMap = {
  headings: [ '6xl', '5xl', '4xl', '3xl', '2xl', 'xl' ],
  body: [
    'lg-bold', 'lg-semi-bold', 'lg',
    'md-bold', 'md-semi-bold', 'md',
    'sm-bold', 'sm-semi-bold', 'sm',
    'xs-bold', 'xs-semi-bold', 'xs',
  ],
  functional: [ 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11' ],
} as const

export const sizes = [
  ...sizesMap.headings,
  ...sizesMap.body,
  ...sizesMap.functional,
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
  children?: React.ReactNode,
  color: TextColor | 'inherit'
  HrefComponent?: React.FC<any>
  message: Intl.Message | string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const Text = React.forwardRef<HTMLElement, TextProps>((props, ref) => {
  const {
    children, className, id, tag = 'div',
    message, size, color, html,
    htmlFor, dataTestId,
    HrefComponent,
    onClick, ...otherProps
  } = props

  const intlControls = intl.useIntl()

  if (onClick && tag !== 'button') {
    throw new Error('You can\'t use "onClick" without passing tag === "button". Create components ADA friendly!')
  }

  const rootClassName = cx(className, {
    [`text-${size}`]: size,
    [`text-${color}`]: color !== 'inherit',
    'font-fragment': [ '6xl', '5xl', '4xl' ].includes(size),
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
    if (/<Href/.test(content as string) && HrefComponent) {
      const children = replaceReactComponents(content as string, { Href: HrefComponent })
        .map((child, index) => typeof child === 'string' ? child : { ...child, key: child.key || index })

      return React.createElement(tag, htmlProps, children)
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
})

Text.displayName = 'Text'


export default React.memo(Text)
