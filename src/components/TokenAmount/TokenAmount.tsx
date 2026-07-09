import React from 'react'
import cx from 'classnames'
import { methods, constants } from 'helpers'

import Logo from '../Logo/Logo'
import Text from '../Text/Text'


export const tokens = [
  'GNO',
  'ETH',
  'SSV',
  'xDAI',
  'Obol',
  'SWISE',
  'osETH',
  'osGNO',
] as const

export const sizes = [ 'sm', 'md', 'xl' ] as const

export type TokenAmountProps = {
  className?: string
  value: bigint | string
  size?: typeof sizes[number]
  token: typeof tokens[number]
  textColor?: typeof constants.colors[number]
  withMinimalValue?: boolean
  dataTestId?: string
}

const params = {
  sm: {
    logoSize: 16,
    textSize: 'sm',
  },
  md: {
    logoSize: 18,
    textSize: 'md',
  },
  xl: {
    logoSize: 20,
    textSize: 'lg',
  },
} as const

const TokenAmount: React.FC<TokenAmountProps> = (props) => {
  const { className, token, value, size = 'md', textColor = 'dark', withMinimalValue, dataTestId } = props

  const sizes = params[size]

  if (!sizes) {
    return null
  }

  const { textSize, logoSize } = sizes

  const containerClassName = cx(className, 'inline-flex items-center', {
    'justify-center': !/justify-(start|end)/.test(className || ''),
  })

  return (
    <div
      className={containerClassName}
      data-testid={dataTestId}
    >
      <Logo
        name={`token/${token}`}
        size={logoSize}
      />
      <Text
        className="ml-4 font-medium"
        message={methods.formatTokenValue(value, withMinimalValue)}
        size={textSize}
        color={textColor}
      />
    </div>
  )
}


export default React.memo(TokenAmount)
