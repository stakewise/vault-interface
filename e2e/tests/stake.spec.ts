import { parseEther, ZeroAddress } from 'ethers'
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

test('Initial info', async ({ swap, page, graphql }) => {
  const { vaultApy, maxBoostApy } = await swap.mockApy({ isProfitable: true })

  await graphql.mockVaultData({
    admin: ZeroAddress,
    totalAssets: parseEther('401050').toString(),
  })

  await swap.openPage('skipSSR=true')
  await page.waitForLoadState('networkidle')

  const [
    maxBoostApyValue,
    vaultApyValue,
    tvlValue,
  ] = await Promise.all([
    swap.getBaseInfoItem('max-boost-apy'),
    swap.getBaseInfoItem('vault-apy'),
    swap.getBaseInfoItem('stake-tvl'),
  ])

  expect(maxBoostApyValue).toEqual(maxBoostApy)
  expect(vaultApyValue).toEqual(vaultApy)
  expect(tvlValue).toEqual(401.05)
})

test('Initial info not profitable', async ({ swap, page, element }) => {
  const { vaultApy } = await swap.mockApy({ isProfitable: false })

  await swap.openPage()
  await page.waitForLoadState('networkidle')

  await element.checkVisibility({ testId: 'max-boost-apy', isVisible: false })

  const osTokenApyValue = await swap.getBaseInfoItem('vault-apy')

  expect(osTokenApyValue).toEqual(vaultApy)
})

test('Stake info', async ({ page, swap, wallet }) => {
  const value = 10

  await swap.openPage()

  await wallet.connectWithBalance({ ETH: '100' })

  await swap.input.fill(value.toString())

  const getPositionInfoItem = async (type: string) => {
    const selector = await page.waitForSelector(`[data-testid="position-${type}"]`)
    const value = await selector.textContent()

    return value || ''
  }

  const [
    stakeToken,
    apy,
    gas,
    receive,
  ] = await Promise.all([
    swap.input.token(),
    getPositionInfoItem('apy-next'),
    getPositionInfoItem('value-prev'),
    getPositionInfoItem('assets-next'),
  ])

  const receiveAmount = Number(receive.replace('osETH', ''))

  expect(stakeToken).toBe('ETH')
  expect(parseFloat(apy)).toBeGreaterThan(0)
  expect(Number(gas.replace('$ ' , ''))).toBeGreaterThan(0)

  expect(receiveAmount).toEqual(value)
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
