import { formatEther } from 'ethers'
import { expect } from '@playwright/test'

import test from '../extendTest'


test.beforeEach(async ({ wallet }) => {
  await wallet.init()
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.helpers.checkConnectButton()
})

test('Token dropdown', async ({ swap, wallet }) => {
  await swap.openPage()

  await swap.helpers.checkTokenDropdown()
  await wallet.connectWithBalance({ ETH: '100' })
  await swap.helpers.checkTokenDropdown()
})

test('Max balance minus gas', async ({ swap, wallet, graphql }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '100' })

  await swap.input.fill()
  await graphql.waitForResponse('HarvestParams')
  await graphql.waitForResponse('HarvestParams')

  const value = await swap.input.value()

  expect(Number(value)).toBeLessThan(100)
  expect(Number(value)).toBeGreaterThan(0)
})

test('Initial info', async ({ swap, vault }) => {
  const vaultApy = '5'
  const maxApy = '10'

  const { totalAssets } = await swap.mocks.swapStats()

  await vault.setVaultData({
    apy: vaultApy,
    allocatorMaxBoostApy: maxApy,
  })

  await swap.openPage('skipSSR=true')

  const [
    maxBoostApyValue,
    vaultApyValue,
    tvl,
  ] = await Promise.all([
    swap.helpers.getBaseInfoItem('max-boost-apy'),
    swap.helpers.getBaseInfoItem('vault-apy'),
    swap.helpers.getBaseInfoItem('stake-tvl'),
  ])

  const [ currectTVL ] = formatEther(totalAssets).split('.')

  expect(maxBoostApyValue).toEqual(Number(maxApy))
  expect(vaultApyValue).toEqual(Number(vaultApy))
  expect(tvl).toEqual(Number(currectTVL))
})

test('Initial info not profitable', async ({ swap, element, vault }) => {
  const vaultApy = '5'

  await vault.setVaultData({
    apy: vaultApy,
    allocatorMaxBoostApy: '1',
  })

  await swap.openPage('skipSSR=true')

  await element.checkVisibility({ testId: 'max-boost-apy', isVisible: false })

  const osTokenApyValue = await swap.helpers.getBaseInfoItem('vault-apy')

  expect(osTokenApyValue).toEqual(Number(vaultApy))
})

test('Stake info', async ({ swap, wallet }) => {
  const value = 10

  await swap.openPage()

  await wallet.connectWithBalance({ ETH: '100' })

  await swap.input.fill(value.toString())

  const [
    stakeToken,
    gas,
    apyPrev,
    apyNext,
    assetPrev,
    assetNext,
  ] = await Promise.all([
    swap.input.token(),
    swap.helpers.getSwapInfoItem('gas'),
    swap.helpers.getSwapInfoItem('apy-prev'),
    swap.helpers.getSwapInfoItem('apy-next'),
    swap.helpers.getSwapInfoItem('asset-prev'),
    swap.helpers.getSwapInfoItem('asset-next'),
  ])

  expect(stakeToken).toBe('ETH')
  expect(parseFloat(apyPrev)).toEqual(0)
  expect(parseFloat(apyNext)).toBeGreaterThan(0)
  expect(parseFloat(assetPrev)).toEqual(0)
  expect(parseFloat(assetNext)).toEqual(value)

  expect(Number(gas.replace('$' , ''))).toBeGreaterThan(0)
})

test('Stake', async ({ wallet, swap }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '100' })

  await swap.actions.stake('50')
})

test('Stake max', async ({ wallet, swap }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '100' })

  await swap.actions.stake()
})
