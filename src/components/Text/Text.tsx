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
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const Text = React.forwardRef<HTMLElement, TextProps>((props, ref) => {
  const {
    children, className, id, tag = 'div',
    message, size, color, html,
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
    [`text-${size}`]: size,
    [`text-${color}`]: color !== 'inherit',
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
})

Text.displayName = 'Text'


export default React.memo(Text)
