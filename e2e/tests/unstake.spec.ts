import { expect } from '@playwright/test'

import test from '../extendTest'


test.beforeEach(async ({ wallet }) => {
  await wallet.init()
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.tab('unstake', true)
  await swap.helpers.checkConnectButton()
})

test('Max balance', async ({ swap, wallet }) => {
  const stakeAmount = '10'

  await swap.openPage()

  await wallet.connectWithBalance({ ETH: '50' })

  await swap.setSdkTransactions({ deposit: stakeAmount })

  await swap.tab('unstake', true)

  await swap.input.fill()

  const value = await swap.input.value()

  expect(value).toEqual(stakeAmount)
})

test('Unstake info', async ({ wallet, swap, user }) => {
  const stakeAmount = '10'
  const userAPY = 5

  await swap.openPage()

  await wallet.connectWithBalance({ ETH: '50' })

  await user.balances.setUserApy(userAPY)

  await swap.setSdkTransactions({ deposit: stakeAmount })

  await swap.tab('unstake', true)

  await swap.input.fill('5')

  const value = await swap.input.value()

  const [
    stakeToken,
    apyPrev,
    apyNext,
    assetPrev,
    assetNext,
    unstakeQueue,
  ] = await Promise.all([
    swap.input.token(),
    swap.helpers.getSwapInfoItem('apy-prev'),
    swap.helpers.getSwapInfoItem('apy-next'),
    swap.helpers.getSwapInfoItem('asset-prev'),
    swap.helpers.getSwapInfoItem('asset-next'),
    swap.helpers.getSwapInfoItem('unstake-queue'),
  ])

  expect(stakeToken).toBe('ETH')
  expect(parseFloat(apyPrev)).toEqual(userAPY)
  expect(parseFloat(apyNext)).toBeLessThan(userAPY)
  expect(parseFloat(assetPrev)).toEqual(Number(stakeAmount))
  expect(parseFloat(assetNext)).toEqual(Number(value))
  expect(parseFloat(unstakeQueue)).toEqual(Number(value))
})

test('Unstake info after mint', async ({ wallet, swap }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '50' })

  await swap.setSdkTransactions({ deposit: '20', mint: '5' })

  await swap.tab('unstake', true)

  await swap.input.fill()

  const value = await swap.input.value()

  expect(Math.round(Number(value))).toEqual(15)
})

test('Unstake', async ({ wallet, swap }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '50' })

  await swap.setSdkTransactions({ deposit: '20' })

  await swap.actions.unstake()
})
