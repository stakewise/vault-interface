import { SetTransaction } from 'components'
import { StakeWiseSDK } from 'sdk'

import { Tab } from '../StakeContext/util'


declare global {

  declare namespace StakePage {

    namespace Tabs {

      type SetTab = (tab: TabsIds) => void

      type Data = {
        value: Tab
        setTab: SetTab
      }
    }

    type ClaimablePosition = {
      exitQueueIndex: string
      positionTicket: string
      timestamp: string
    }

    namespace Stake {

      type SubmitInput = {
        setTransaction: SetTransaction
      }

      type Actions = {
        isSubmitting: boolean
        isApproveRequired: boolean
        submit: (input?: SubmitInput) => Promise<void>
        getMaxStake: () => Promise<bigint>
        getTransactionGas: () => Promise<bigint>
        calculateSwap: (amount: bigint) => Promise<{
          receiveShares: bigint
          exchangeRate: bigint
        }>,
      }
    }

    namespace Boost {

      type SubmitInput = {
        permitAddress?: string
        setTransaction?: SetTransaction
        onSuccess?: () => void
      }

      type Actions = {
        allowance: bigint
        isFetching: boolean
        isSubmitting: boolean
        isAllowanceFetching: boolean
        checkSupplyCap: (value: bigint) => boolean
        submit: (values?: SubmitInput) => Promise<void>
      }
    }

    namespace Unboost {

      type Actions = {
        submit: () => void
        isDisabled: boolean
        isSubmitting: boolean
      }
    }

    namespace Unstake {

      type Tx = {
        data: string
        to: string
      }

      type BalancerSwapData = {
        returnAmount: string
        transactionData: Tx
      }

      type SubmitInput = {
        setTransaction: SetTransaction
      }

      type SwapData = {
        tx: Tx
        isExchange?: boolean
        amountShares: bigint
        receiveAssets: bigint
        isVaultAction?: boolean
      }

      type TxData = {
        gas: bigint
        rate: bigint
        vaultAssets: bigint
        exchangeAssets: bigint
        isFetching: boolean
      }

      type Actions = {
        txData: TxData
        refetchAllowance: number
        isFetching: boolean
        isSubmitting: boolean
        getMaxStake: () => bigint
        submit: () => void
        getTransactionGas: () => Promise<bigint>
        calculateSwap: (amount: bigint) => Promise<{
          exchangeRate: bigint
          swapData: SwapData[]
        }>
      }
    }

    namespace UnstakeQueue {

      type Data = {
        total: bigint
        withdrawable: bigint
        isFetching: boolean
        isSubmitting: boolean
        duration: number | null
        positions: ClaimablePosition[]
        requests: Awaited<ReturnType<StakeWiseSDK['vault']['getExitQueuePositions']>>['requests']
        claim: () => Promise<void>
        refetchData: () => Promise<void>
      }
    }

    namespace UnboostQueue {

      type Data = {
        isFetching: boolean
        isClaimable: boolean
        exitingShares: bigint
        exitingAssets: bigint
        isSubmitting: boolean
        duration: number | null
        position: ClaimablePosition | null
        claim: () => Promise<void>
        refetchData: () => Promise<void>
      }
    }

    type Data = {
      tvl: string
      fee: string
      users: number
      ltvPercent: bigint
      stakedAssets: bigint
      mintTokenBalance: bigint
      apy: {
        user: number
        vault: number
        mintToken: number
        maxBoost: number
      }
      boost: {
        shares: bigint
        rewardAssets: bigint
        exitingPercent: number
        maxMintShares: bigint
        isProfitable: boolean
      }
      isFetching: boolean
      refetchData: () => Promise<void>
    }

    type Context = {
      data: Data
      tabs: Tabs.Data
      boost: Boost.Actions
      stake: Stake.Actions
      field: Forms.Field<bigint>
      unboost: Unboost.Actions
      unstake: Unstake.Actions
      vaultAddress: string
      unboostQueue: UnboostQueue.Data
      unstakeQueue: UnstakeQueue.Data
      percentField: Forms.Field<string>
      isFetching: boolean
    }

    type Input = {
      vaultAddress: string
    }
  }
}
