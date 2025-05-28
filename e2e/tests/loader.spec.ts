import { ZeroAddress } from 'ethers'

import * as constants from '../constants'
import test from '../extendTest'


test('Connect wallet | Disconnect wallet', async ({ page, wallet, swap, gui, guardian }) => {
  await guardian.fixProvider()
  await gui.initializeChain(1)

  await page.goto('/')
  await swap.checkSwapRender()

  await wallet.monitorAddress(ZeroAddress)
  await swap.checkSwapRender()

  await wallet.disconnect({ wallet: constants.walletTitles.monitorAddress })
  await swap.checkSwapRender()

  await wallet.connect()
  await swap.checkSwapRender()

  await wallet.disconnect()
  await swap.checkSwapRender()
})

test('Change chain', async ({ page, wallet, swap, helpers }) => {
  await page.goto('/')
  await helpers.changeSelect('network-select', 'gnosis')
  await swap.checkSwapRender()

  await wallet.monitorAddress(ZeroAddress)
  await swap.checkSwapRender()

  await helpers.changeSelect('network-select', 'mainnet')
  await swap.checkSwapRender()

  await wallet.disconnect({ wallet: constants.walletTitles.monitorAddress })
  await swap.checkSwapRender()
})
