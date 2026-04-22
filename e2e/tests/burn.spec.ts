import { expect } from '@playwright/test'

import test from '../extendTest'


test.beforeEach(async ({ wallet }) => {
  await wallet.init()
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.tab('burn', true)
  await swap.helpers.checkConnectButton()
})

test('Max burn', async ({ swap, wallet }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '50' })

  const shares = await swap.setSdkTransactions({ deposit: '20', mint: '5' })

  await swap.tab('burn', true)

  await swap.input.fill()

  const value = await swap.input.value()

  expect(value).toEqual(shares)
})

test('Burn info', async ({ wallet, swap, user, helpers }) => {
  const userAPY = 5

  await swap.openPage()

  await wallet.connectWithBalance({ ETH: '50' })

  await user.balances.setUserApy(userAPY)

  const shares = await swap.setSdkTransactions({ deposit: '20', mint: '5' })

  await swap.tab('burn', true)

  await swap.input.fill()

  const [
    mintToken,
    apyPrev,
    apyNext,
    sharesPrev,
    sharesNext,
  ] = await Promise.all([
    swap.input.token(),
    swap.helpers.getSwapInfoItem('apy-prev'),
    swap.helpers.getSwapInfoItem('apy-next'),
    swap.helpers.getSwapInfoItem('shares-prev'),
    swap.helpers.getSwapInfoItem('shares-next'),
  ])

  expect(mintToken).toEqual('osETH')
  expect(parseFloat(apyPrev)).toEqual(userAPY)
  expect(parseFloat(apyNext)).toBeLessThan(userAPY)
  expect(parseFloat(sharesPrev)).toEqual(Number(helpers.formatTokenValue(shares || '')))
  expect(parseFloat(sharesNext)).toEqual(0)
})

test('Burn 15', async ({ wallet, swap }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '50' })

  const shares =  await swap.setSdkTransactions({ deposit: '20', mint: '15' })

  await swap.actions.burn(shares)
})

test('Burn max', async ({ wallet, swap }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '50' })

  await swap.setSdkTransactions({ deposit: '20', mint: '15' })

  await swap.actions.burn()
})
