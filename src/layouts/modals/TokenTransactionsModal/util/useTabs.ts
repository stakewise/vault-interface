import { useEffect, useMemo } from 'react'
import { constants } from 'helpers'
import forms from 'sw-modules/forms'
import { useConfig } from 'config'


type Input = {
  closeModal: () => void
}

type Output = {
  tabsList: Tab[]
  tabField: Forms.Field<string>
}

const useTabs = ({ closeModal }: Input): Output => {
  const { sdk, address, isAddressChanged } = useConfig()

  const tabsList = useMemo(() => [
    {
      id: constants.tokens.swise,
      title: constants.tokens.swise,
      dataTestId: 'swise-tab',
    },
    {
      id: constants.tokens.osToken,
      title: sdk.config.tokens.mintToken,
      dataTestId: 'osToken-tab',
    },
  ], [ sdk ])

  const tabField = forms.useField<string>({
    valueType: 'string',
    initialValue: tabsList[0].id,
  })

  useEffect(() => {
    if (!address || isAddressChanged) {
      closeModal()
    }
  }, [ address, closeModal, isAddressChanged ])

  return useMemo(() => ({
    tabField,
    tabsList,
  }), [ tabField, tabsList ])
}


export default useTabs
