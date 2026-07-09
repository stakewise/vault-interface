import React from 'react'
import cx from 'classnames'
import device from 'modules/device'

import Logo from '../Logo/Logo'
import Text from '../Text/Text'
import type { TokenAmountProps } from '../TokenAmount/TokenAmount'


export type TokenProps = {
  className?: string
  token: TokenAmountProps['token']
  dataTestId?: string
}

const Token: React.FC<TokenProps> = (props) => {
  const { className, token, dataTestId } = props

  const { isDesktop } = device.useData()

  return (
    <div className={cx(className, 'flex justify-end items-center')}>
      <Logo
        className="mr-4"
        name={`token/${token}`}
      />
      <Text
        className="font-bold"
        message={token}
        size={!isDesktop ? 'sm' : 'lg'}
        color="dark"
        dataTestId={dataTestId}
      />
    </div>
  )
}


export default React.memo(Token)
