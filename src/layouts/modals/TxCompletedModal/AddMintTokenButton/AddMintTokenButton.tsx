import React, { useCallback } from 'react'
import methods from 'sw-methods'
import { useConfig } from 'config'
import { useAddTokenToWallet } from 'sw-hooks'

import { imagesUrls, Button } from 'components'

import messages from './messages'


type AddMintTokenButtonProps = {
  className?: string
  onClick?: () => void
}

const AddMintTokenButton: React.FC<AddMintTokenButtonProps> = (props) => {
  const { className, onClick } = props

  const { sdk, library } = useConfig()

  const addToken = useAddTokenToWallet(library)

  const token = sdk.config.tokens.mintToken
  const address = sdk.config.addresses.tokens.mintToken

  const handleAddToken = useCallback(() => {
    const hostname = methods.getOriginHostName()
    const url = `${hostname}/${imagesUrls[`token/${token}` as keyof typeof imagesUrls]}`

    addToken({
      address,
      image: url,
      symbol: token,
    })

    if (typeof onClick === 'function') {
      onClick()
    }
  }, [ address, token, addToken, onClick ])

  return (
    <Button
      className={className}
      title={{
        ...messages.title,
        values: { token },
      }}
      fullWidth
      withoutPadding
      onClick={handleAddToken}
    />
  )
}


export default React.memo(AddMintTokenButton)
