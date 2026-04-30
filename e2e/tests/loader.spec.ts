import { ZeroAddress } from 'ethers'

import * as constants from '../constants'
import test from '../extendTest'


test('Connect wallet | Disconnect wallet', async ({ page, wallet, swap }) => {
  await wallet.init()

  await page.goto('/')
  await swap.helpers.checkSwapRender()

  await wallet.monitorAddress(ZeroAddress)
  await swap.helpers.checkSwapRender()

  await wallet.disconnect({ wallet: constants.walletTitles.monitorAddress })
  await swap.helpers.checkSwapRender()

  await wallet.connect()
  await swap.helpers.checkSwapRender()

  await wallet.disconnect()
  await swap.helpers.checkSwapRender()
})

test('Change chain', async ({ page, wallet, swap, helpers }) => {
  await page.goto('/')
  await helpers.changeSelect('network-select', 'gnosis')
  await swap.helpers.checkSwapRender()

  await wallet.monitorAddress(ZeroAddress)
  await swap.helpers.checkSwapRender()

  await helpers.changeSelect('network-select', 'mainnet')
  await swap.helpers.checkSwapRender()

  await wallet.disconnect({ wallet: constants.walletTitles.monitorAddress })
  await swap.helpers.checkSwapRender()
})
