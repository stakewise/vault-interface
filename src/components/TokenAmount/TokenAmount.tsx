import React from 'react'
import cx from 'classnames'
import methods from 'sw-methods'

import Logo from '../Logo/Logo'
import Text from '../Text/Text'
import { constants } from '../../helpers'


export const tokens = [
  'GNO',
  'ETH',
  'xDAI',
  'sGNO',
  'rGNO',
  'SWISE',
  'osETH',
  'osGNO',
  'rETH2',
  'sETH2',
] as const

export const sizes = [ 'sm', 'md', 'xl' ] as const

export type TokenAmountProps = {
  className?: string
  value: bigint | string
  size?: typeof sizes[number]
  token: typeof tokens[number]
  textColor?: typeof constants.colors[number]
  dataTestId?: string
}

const params = {
  sm: {
    logoSize: 16,
    textSize: 't14m',
  },
  md: {
    logoSize: 24,
    textSize: 't18m',
  },
  xl: {
    logoSize: 24,
    textSize: 'h20',
  },
} as const

const TokenAmount: React.FC<TokenAmountProps> = (props) => {
  const { className, token, value, size = 'md', textColor = 'moon', dataTestId } = props

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
        className="ml-4"
        message={methods.formatTokenValue(value)}
        size={textSize}
        color={textColor}
      />
    </div>
  )
}


export default React.memo(TokenAmount)
