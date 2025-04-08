import React, { useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import intl from 'modules/intl'
import modal from 'modules/modal'
import methods from 'helpers/methods'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { createContracts } from 'helpers/contracts'
import { commonMessages, requests } from 'helpers'
import { useStore, useActions, useClaimsTotal, useSubgraphUpdate } from 'hooks'
import notifications from 'modules/notifications'

import { Button, FiatAmount, Modal, Text, TokenAmount } from 'components'

import messages from './messages'


const storeSelector = (store: Store) => ({
  distributorClaims: store.account.distributorClaims.data,
})

export const [ DistributorClaimsModal, openDistributorClaimsModal ] = (
  modal.wrapper(UNIQUE_FILE_ID, (props) => {
    const { closeModal } = props

    const actions = useActions()
    const claimsTotal = useClaimsTotal()
    const subgraphUpdate = useSubgraphUpdate()
    const { formatMessage } = intl.useIntl()
    const { sdk, signSDK, address, isReadOnlyMode } = useConfig()
    const { distributorClaims } = useStore(storeSelector)

    const [ isSubmitting, setSubmitting ] = useState(false)

    const tokensList = useMemo(() => {
      const { tokens, unclaimedAmounts } = distributorClaims

      const tokenNames = Object.keys(sdk.config.addresses.tokens).reduce((acc, tokenKey) => {
        const tokenAddress = sdk.config.addresses.tokens[tokenKey as keyof typeof sdk.config.addresses.tokens]
        const tokenName = sdk.config.tokens[tokenKey as keyof typeof sdk.config.tokens]

        if (tokenName) {
          acc[tokenAddress] = tokenName
        }

        return acc
      }, {} as Record<string, string>)

      return tokens.map((tokenAddress, index) => {
        const value = formatEther(unclaimedAmounts[index])

        return {
          token: tokenNames[tokenAddress],
          value,
        }
      })
    }, [ sdk, distributorClaims ])

    const refetchClaims = useCallback(async (address: string) => {
      actions.account.distributorClaims.resetData()

      try {
        const distributorClaims = await requests.fetchDistributorClaims({
          url: sdk.config.api.subgraph,
          address,
        })

        actions.account.distributorClaims.setData(distributorClaims || {})
      }
      catch (error) {
        actions.account.distributorClaims.setFetching(false)
        console.error('Refetch distributor claims error', error as Error)
      }
    }, [ sdk, actions ])

    const handleClaim = useCallback(async () => {
      const { proof, tokens, cumulativeAmounts, unclaimedAmounts } = distributorClaims

      const isClaimAvailable = unclaimedAmounts.some((amount) => Number(amount))

      if (isClaimAvailable && address) {
        try {
          setSubmitting(true)

          const contracts = createContracts(signSDK)
          const signer = await signSDK.provider.getSigner(address)
          const signedContract = contracts.base.merkleDistributorV2.connect(signer)
          const estimatedGas = await signedContract.claim.estimateGas(address, tokens, cumulativeAmounts, proof)

          const { hash } = await signedContract.claim(address, tokens, cumulativeAmounts, proof, {
            gasLimit: methods.getGasMargin(estimatedGas),
          })

          await subgraphUpdate({ hash })

          refetchClaims(address)
          closeModal()
        }
        catch (error) {
          console.error('Claim rewards error', error as Error)

          setSubmitting(false)
          actions.ui.resetBottomLoader()

          notifications.open({
            type: 'error',
            text: commonMessages.notification.failed,
          })
        }
      }
    }, [ signSDK, address, distributorClaims, actions, closeModal, refetchClaims, subgraphUpdate ])

    return (
      <Modal
        className="text-center"
        title={messages.title}
        description={messages.description}
        size="narrow"
        closeModal={closeModal}
      >
        <div className="mt-16">
          {
            tokensList.map(({ token, value }, index) => (
              <div
                key={token}
                className={cx('flex items-center justify-between', {
                  'mt-8 pt-8 border-top border-moon/10': index,
                })}
              >
                <Text
                  message={token}
                  size="t16m"
                  color="dark"
                />
                <div className="flex flex-col items-end">
                  <TokenAmount
                    token={token as 'osETH'}
                    value={value}
                    size="sm"
                  />
                  <FiatAmount
                    className="opacity-60"
                    token={token as 'osETH'}
                    amount={value}
                    color="dark"
                    size="t12m"
                  />
                </div>
              </div>
            ))
          }
        </div>
        <Button
          className="mt-24"
          title={`${formatMessage(commonMessages.buttonTitle.claim)} ${claimsTotal}`}
          color="primary"
          fullWidth
          disabled={isSubmitting || isReadOnlyMode}
          onClick={handleClaim}
        />
      </Modal>
    )
  })
)
