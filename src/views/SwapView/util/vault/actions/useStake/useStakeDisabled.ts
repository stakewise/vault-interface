import { useConfig } from 'config'
import forms from 'modules/forms'


type Input = {
  field: Forms.Field<bigint>
}

const isEnvStakeDisabled = Boolean(process.env.NEXT_PUBLIC_DISABLE_STAKE)

const useStakeDisabled = (values: Input) => {
  const { field } = values

  const { error } = forms.useFieldValue(field)
  const { address, isReadOnlyMode } = useConfig()

  const isStakeDisabled = (
    !address
    || Boolean(error)
    || isReadOnlyMode
    || isEnvStakeDisabled
  )

  return isStakeDisabled
}


export default useStakeDisabled
