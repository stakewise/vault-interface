import { expect } from '@playwright/test'

import test from '../extendTest'


test.beforeEach(async ({ gui, guardian }) => {
  await guardian.fixProvider()
  await gui.initializeChain(1)
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.tab('mint')
  await swap.helpers.checkConnectButton()
})

test('Mint info', async ({ wallet, swap, user, helpers }) => {
  const userAPY = 3

  await user.balances.setUserApy(userAPY)
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '100' })

  await swap.actions.stake('10')

  await swap.tab('mint')

  await swap.input.fill()

  const value = await swap.input.value()

  const [
    mintToken,
    apyPrev,
    apyNext,
    rate,
    fee,
    sharesPrev,
    sharesNext,
  ] = await Promise.all([
    swap.input.token(),
    swap.helpers.getSwapInfoItem('apy-prev'),
    swap.helpers.getSwapInfoItem('apy-next'),
    swap.helpers.getSwapInfoItem('rate'),
    swap.helpers.getSwapInfoItem('fee'),
    swap.helpers.getSwapInfoItem('shares-prev'),
    swap.helpers.getSwapInfoItem('shares-next'),
  ])

  const mintTokenRate = parseFloat(rate.split('=')[1].split(' ')[1])

  expect(mintToken).toBe('osETH')
  expect(mintTokenRate).toBeGreaterThan(0)

  expect(parseFloat(apyPrev)).toEqual(userAPY)
  expect(parseFloat(apyNext)).toBeLessThan(userAPY)

  expect(parseFloat(fee)).toEqual(5)

  expect(parseFloat(sharesPrev)).toEqual(0)
  expect(parseFloat(sharesNext)).toEqual(Number(helpers.formatTokenValue(value || '')))
})

test('Mint Max', async ({ wallet, swap }) => {
  const stakedAssets = '10'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '100' })

  await swap.actions.stake(stakedAssets)
  await swap.actions.mint({ stakedAssets })
})

test('Mint after mint', async ({ wallet, swap, helpers }) => {
  const stakedAssets = '10'
  const mintAssets = '5'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '50' })

  await swap.actions.stake(stakedAssets)
  await swap.actions.mint({ stakedAssets, amount: mintAssets })

  await swap.tab('mint')

  await swap.input.fill()
  const value = await swap.input.value()

  const [
    sharesPrev,
    sharesNext,
  ] = await Promise.all([
    swap.helpers.getSwapInfoItem('shares-prev'),
    swap.helpers.getSwapInfoItem('shares-next'),
  ])

  const totalShares = String(Number(sharesPrev) + Number(value))

  expect(parseFloat(sharesNext)).toEqual(Number(helpers.formatTokenValue(totalShares)))
})
