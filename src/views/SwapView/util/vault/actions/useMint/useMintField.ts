import { useRef } from 'react'
import { parseEther, MaxInt256 } from 'ethers'
import forms from 'modules/forms'
import { StakeWiseSDK } from 'sdk'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import messages from './messages'


const checkCapacity = (capacity: { current: bigint }) => (value?: Forms.FieldValue) => {
  if (isNaN(Number(capacity.current))) {
    return
  }

  if (capacity.current < (value as bigint)) {
    return { ...messages.capacityError }
  }
}

const checkMintAvailable = (mintShares: { current: bigint }, sdk: StakeWiseSDK) => (value?: Forms.FieldValue) => {
  if (!mintShares.current || mintShares.current < (value as bigint)) {
    return {
      ...messages.maxMintError,
      values: {
        depositToken: sdk.config.tokens.depositToken,
        mintToken: sdk.config.tokens.mintToken,
      },
    }
  }
}

const storeSelector = (store: Store) => ({
  capacity: store.vault.base.data.capacity,
  maxMintShares: store.vault.user.balances.mintToken.maxMintShares,
})

const useMintField = () => {
  const { capacity, maxMintShares } = useStore(storeSelector)

  const { sdk } = useConfig()

  const maxMintSharesRef = useRef(maxMintShares)
  maxMintSharesRef.current = maxMintShares

  const capacityRef = useRef(parseEther(capacity === '∞' ? MaxInt256.toString() : capacity))
  capacityRef.current = parseEther(capacity === '∞' ? MaxInt256.toString() : capacity)

  const field = forms.useField<bigint>({
    valueType: 'bigint',
    validators: [
      checkMintAvailable(maxMintSharesRef, sdk),
      forms.validators.numberWithDot,
      checkCapacity(capacityRef),
    ],
  })

  return field
}


export default useMintField
