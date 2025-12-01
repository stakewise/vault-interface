import type { BoostSupplyCapsQueryPayload } from 'helpers/requests/fetchBoostSupplyCaps'

import * as constants from '../../../constants'


export type BoostInfo = () => Promise<void>

type Wrapper = E2E.FixtureMethod<BoostInfo, 'graphql' | 'vault' >

export const createBoostInfo: Wrapper = ({ graphql, vault }) => (
  async () => {
    await vault.setVaultData()

    await graphql.mockCustomData<BoostSupplyCapsQueryPayload>({
      name: 'BoostSupplyCaps',
      data: {
        aave: {
          osTokenTotalSupplied: '0',
          osTokenSupplyCap: String(constants.maxUint256),
        },
      },
    })
  }
)
