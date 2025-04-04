import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import methods from 'helpers/methods'
import { useConfig } from 'config'
import { isAddress } from 'ethers'
import forms from 'modules/forms'

import { Form, Input } from 'components'

import SubmitButton from './SubmitButton/SubmitButton'

import messages from './messages'


type MonitorAddressViewProps = {
  className?: string
}

const MonitorAddressView: React.FC<MonitorAddressViewProps> = (props) => {
  const { className } = props

  const { sdk, wallet } = useConfig()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const addressField = forms.useField<string>({
    valueType: 'string',
    type: 'address',
  })

  const handleSubmit = useCallback(async () => {
    const { value, error } = addressField

    let address

    setSubmitting(true)

    if (isAddress(value)) {
      address = value
    }
    else if (value) {
      const result = await methods.ens.fetchAddress({
        provider: sdk.provider,
        chainId: sdk.config.network.chainId,
        ensName: value,
      })

      const isValidAddress = isAddress(result)

      if (isValidAddress) {
        address = result

        setSubmitting(false)
      }
      else {
        addressField.setError(messages.errors.customEns)
      }
    }

    if (!error && address) {
      wallet.setAddress(address)
    }

    setSubmitting(false)
  }, [ sdk, wallet, addressField ])

  return (
    <Form
      className={cx(className, 'flex flex-col justify-between')}
      onSubmit={handleSubmit}
    >
      <Input
        label={messages.label}
        field={addressField}
        autoFocus
        disabled={isSubmitting}
        dataTestId="check-wallet-input"
      />
      <SubmitButton
        className="mt-24"
        addressField={addressField}
        loading={isSubmitting}
      />
    </Form>
  )
}


export default React.memo(MonitorAddressView)
