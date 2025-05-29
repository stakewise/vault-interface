import { Contract, BaseContract } from 'ethers'
import { JsonRpcProvider } from 'ethers'


type Wrapper = E2E.FixtureMethod<SetBalance, 'page'>

type Input = {
  tokenAddress: string
  amount: string
}

type TransferContract = BaseContract & {
  transfer: (address: string, amount: string, overrides: { from: string }) => Promise<{ hash: string }>
}

export type SetBalance = (values: Input) => Promise<void>

const impersonateAccount = async (address: string) => {
  try {
    await provider.send('anvil_impersonateAccount', [
      address,
    ])
  }
  catch {}
}

const provider = new JsonRpcProvider('http://localhost:8545', 1)

const holders = {
  osETH: '0x57ba429517c3473b6d34ca9acd56c0e735b94c02',
}

const impersonatePromises = {
  osETH: impersonateAccount(holders.osETH),
}

const transferAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

// ATTN fallback for gui.setBalance, that doesn't work in CI
export const createSetBalance: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { tokenAddress, amount } = values

    const holder = holders.osETH
    const impersonatePromise = impersonatePromises.osETH

    const getAddressPromise = page.evaluate('window.ethereum.signer.address')

    const setBalancePromise = provider.send('anvil_setBalance', [
      holder,
      `0x${BigInt(100000000000000000000000).toString(16)}`,
    ])

    const [ address ] = await Promise.all([
      getAddressPromise,
      impersonatePromise,
      setBalancePromise,
    ])

    const signer = await provider.getSigner(holder)
    const tokenContract = new Contract(tokenAddress, transferAbi).connect(signer) as TransferContract

    const receipt = await tokenContract.transfer(address as string, amount, {
      from: holder,
    })

    await provider.waitForTransaction(receipt.hash, 6)
  }
)
