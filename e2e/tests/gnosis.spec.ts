import { expect } from '@playwright/test'

import * as constants from '../constants'
import test from '../extendTest'


test('Default & swap balances', async ({ page, helpers, wallet }) => {
  await page.goto('/')
  await helpers.changeSelect('network-select', 'gnosis')

  await wallet.monitorAddress(constants.addresses.withGNO)

  const maxStake = await page.waitForSelector(`[data-testid="amount-input-balance"]`)
  const stakeBalance = await maxStake.textContent()

  expect(stakeBalance).toMatch(/0\.01/)

  await helpers.checkBalances({
    GNO: '0.01',
    osGNO: '0.01',
  })
})
