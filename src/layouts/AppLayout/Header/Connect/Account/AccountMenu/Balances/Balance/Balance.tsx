import React, { useCallback, useMemo } from 'react'
import { commonMessages, constants } from 'helpers'
import { useAddTokenToWallet } from 'hooks'
import { useConfig } from 'config'
import methods from 'sw-methods'
import cx from 'classnames'

import { imagesUrls, FiatAmount, TokenAmount, Text, RoundButton, Bone } from 'components'


type BalanceProps = {
  className?: string
  token: Extract<Tokens, 'osETH' | 'osGNO' | 'GNO' | 'ETH' | 'xDAI'>
  value: bigint
  isFetching?: boolean
}

type Params = Record<'osETH' | 'osGNO' | 'GNO', {
  image: string
  address: string
}>

const Balance: React.FC<BalanceProps> = (props) => {
  const { className, token, value, isFetching } = props

  const { sdk, activeWallet, library, isInjectedWallet } = useConfig()
  const addToken = useAddTokenToWallet(library)

  const params = useMemo<Params>(() => ({
    [constants.tokens.gno]: {
      image: imagesUrls[`token/GNO`],
      address: sdk.config.addresses.tokens.depositToken,
    },
    [constants.tokens.osGNO]: {
      image: imagesUrls[`token/osGNO`],
      address: sdk.config.addresses.tokens.mintToken,
    },
    [constants.tokens.osETH]: {
      image: imagesUrls[`token/osETH`],
      address: sdk.config.addresses.tokens.mintToken,
    },
  }), [ sdk ])

  const handleClick = useCallback(() => {
    const data = params[token as keyof typeof params]

    if (data && isInjectedWallet) {
      const hostname = methods.getOriginHostName()

      addToken({
        symbol: token,
        address: data.address,
        image: `${hostname}/${data.image}`,
      })
    }
  }, [ params, token, isInjectedWallet, addToken ])

  const containerClassName = cx(
    className,
    'px-12 py-4 flex items-center justify-between',
    'rounded-8 bg-dark/03 border border-dark/03'
  )

  const withAddTokenButton = Boolean(
    typeof addToken === 'function'
    && token !== sdk.config.tokens.nativeToken
    && activeWallet !== constants.walletNames.monitorAddress
  )

  return (
    <div className={containerClassName}>
      <div className="flex items-center justify-start">
        <Text
          message={token}
          color="dark"
          size="t14m"
        />
        {
          withAddTokenButton && (
            <RoundButton
              className="ml-8"
              icon="icon/plus"
              color="secondary"
              size={24}
              dataTestId={`${token}-add-button`}
              ariaLabel={commonMessages.accessibility.addTokenToWallet}
              onClick={handleClick}
            />
          )
        }
      </div>
      {
        isFetching ? (
          <div className="flex flex-col items-end">
            <Bone w={57} h={18} delay={1} />
            <Bone className="mt-4" w={47} h={16} delay={2} />
          </div>
        ) : (
          <div className="text-right">
            <TokenAmount
              token={token}
              value={value}
              size="sm"
              dataTestId={`${token}-amount`}
            />
            <FiatAmount
              className="opacity-60"
              amount={value}
              token={token}
              color="dark"
              size="t12m"
              dataTestId={`${token}-fiat-amount`}
            />
          </div>
        )
      }
    </div>
  )
}


export default React.memo(Balance)
