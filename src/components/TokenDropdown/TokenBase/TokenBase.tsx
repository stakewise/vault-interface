import React from 'react'
import cx from 'classnames'

import { Loading, Token } from 'components'


export type TokenBaseProps = {
  className?: string
  token: Tokens
  dataTestId?: string
  isFetching?: boolean
}

const TokenBase: React.FC<TokenBaseProps> = (props) => {
  const { className, token, dataTestId, isFetching } = props

  const tokenBaseNode = (
    <Token
      className="flex-shrink-0"
      dataTestId={dataTestId}
      token={token}
    />
  )

  if (isFetching) {
    return (
      <div
        className={cx(className, 'flex items-center gap-8')}
      >
        {tokenBaseNode}
        <Loading
          className="flex-none"
          size={16}
          color="dark"
        />
      </div>
    )
  }

  return tokenBaseNode
}


export default React.memo(TokenBase)
