import { useApprove } from 'hooks'
import { useConfig } from 'config'


interface Hook {
  (vaultAddress: string): ReturnType<typeof useApprove>
  mock: ReturnType<typeof useApprove>
}

const useDepositTokenApprove: Hook = (vaultAddress: string) => {
  const { signSDK, isGnosis } = useConfig()

  return useApprove({
    tokenAddress: signSDK.config.addresses.tokens.depositToken,
    recipient: vaultAddress,
    skip: !isGnosis,
  })
}

useDepositTokenApprove.mock = {
  allowance: 0n,
  isFetching: false,
  isSubmitting: false,
  approve: () => Promise.resolve(undefined),
  checkAllowance: () => Promise.resolve(undefined),
}


export default useDepositTokenApprove
