import React, { useMemo } from 'react'
import cx from 'classnames'
import forms from 'modules/forms'
import { useConfig } from 'config'
import device from 'modules/device'

import Text from '../../Text/Text'

import Option from './Option/Option'
import TokenSearch from './TokenSearch/TokenSearch'
import TokenSkeleton from './TokenSkeleton/TokenSkeleton'
import ScrollableContainer from '../../ScrollableContainer/ScrollableContainer'

import messages from './messages'


const tokensMock = [ ...new Array(5) ]

export type TokenOptionsProps = {
  field: Forms.Field<string>
  tokens: SwapToken[]
  isFetching?: boolean
  dataTestId?: string
}

const TokenOptions: React.FC<TokenOptionsProps> = (props) => {
  const { field, tokens, isFetching, dataTestId } = props

  const { sdk, isGnosis } = useConfig()

  const { isMobile } = device.useData()
  const { value: search } = forms.useFieldValue(field)

  const filteredTokens = useMemo(() => {
    const lowerCasedSearch = search?.toLowerCase() || ''

    if (search) {
      return tokens.filter((token) => {
        const { name, address } = token

        const lowerCasedName = name.toLowerCase()
        const lowerCasedAddress = address.toLowerCase()

        return (
          lowerCasedName.includes(lowerCasedSearch)
          || lowerCasedAddress.includes(lowerCasedSearch)
        )
      })
    }

    return tokens
  }, [ tokens, search ])

  return (
    <>
      <TokenSearch
        className={cx({
          'min-w-[320rem]': !isMobile,
          'w-[calc(100vw-48rem-2px)]': isMobile,
        })}
        field={field}
        data-testid={`${dataTestId}-input`}
      />
      {
        isFetching ? (
          <ScrollableContainer
            className="overflow-y-auto"
            fadeClassName="fixed"
            style={{
              height: `calc(5 * 56rem - 28rem)`,
            }}
          >
            <div>
              {
                tokensMock.map((_, index) => (
                  <TokenSkeleton key={index} />
                ))
              }
            </div>
          </ScrollableContainer>
        ) : (
          filteredTokens.length ? (
            <ScrollableContainer
              className="overflow-y-auto"
              fadeClassName="fixed"
              style={{
                height: filteredTokens.length > 5
                  ? `calc(5 * 56rem - 28rem)`
                  : `calc(${filteredTokens.length} * 56rem)`,
              }}
            >
              <div>
                {
                  filteredTokens.map((swapToken, index) => {
                    const { name, address } = swapToken

                    const swapTokenAddress = name === sdk.config.tokens.depositToken && isGnosis
                      ? sdk.config.addresses.tokens.depositToken
                      : address

                    return (
                      <Option
                        key={index}
                        data={{
                          ...swapToken,
                          address: swapTokenAddress,
                        }}
                        data-testid={`${dataTestId}-option-${name}`}
                      />
                    )
                  })
                }
              </div>
            </ScrollableContainer>
        ) : (
          <Text
            className="my-24 text-center"
            message={messages.noData}
            color="dark"
            size="t16m"
          />
          )
        )
      }
    </>
  )
}


export default React.memo(TokenOptions)
