export type ActionType = 'stake' | 'unstake' | 'mint' | 'burn' | 'boost' | 'unboost'

export type Input = {
  field: Forms.Field<bigint>
  type: ActionType
  depositAmount?: bigint
  modifier?: (bigint) => bigint
}
