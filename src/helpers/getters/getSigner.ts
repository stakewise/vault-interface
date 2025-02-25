import { VoidSigner } from 'ethers'
import { walletNames } from 'sw-helpers/constants'


type Input = {
  sdk: SDK
  signSDK: SDK
  address: string | null
  activeWallet: WalletIds | null
}

// Needed when we make staticCall requests with readOnly connection
const getSigner = async (values: Input) => {
  const { signSDK, sdk, address, activeWallet } = values

  if (!address || !activeWallet) {
    throw new Error("Empty address in getSigner()")
  }

  const signer = activeWallet === walletNames.monitorAddress
    ? new VoidSigner(address, sdk.provider)
    : await signSDK.provider.getSigner(address)

  return signer
}


export default getSigner
