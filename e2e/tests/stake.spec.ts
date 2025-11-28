import { formatEther } from 'ethers'
import { expect } from '@playwright/test'

import test from '../extendTest'


test.beforeEach(async ({ gui, guardian }) => {
  await guardian.fixProvider()
  await gui.initializeChain(1)
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.checkConnectButton()
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

  const { totalAssets } = await swap.setSwapStats()

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
    swap.getBaseInfoItem('max-boost-apy'),
    swap.getBaseInfoItem('vault-apy'),
    swap.getBaseInfoItem('stake-tvl'),
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

  const osTokenApyValue = await swap.getBaseInfoItem('vault-apy')

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

  expect(Number(gas.replace('$ ' , ''))).toBeGreaterThan(0)
})

test('Stake submit', async ({ wallet, swap, transactions }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '100' })

  await swap.mockApy({ isProfitable: true })
  await swap.submit('50')

  await transactions.checkTxCompletedModal({
    action: 'stake',
    value: '50',
  })

  await swap.tab('balance')
})

test('Stake max', async ({ wallet, swap, transactions }) => {
  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '100' })
  await swap.submit()

  await transactions.checkTxCompletedModal({
    action: 'stake',
    less: '100',
  })
})
