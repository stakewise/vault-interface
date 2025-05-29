import test from '../extendTest'


test('Settings', async ({ page, settings }) => {
  await page.goto('/')

  await settings.checkTheme()
  await settings.checkCurrency()
  await settings.checkLanguage()
})

test('Select wallet', async ({ page, wallet, element }) => {
  await page.goto('/')

  await wallet.checkWalletList(false, false)

  await element.checkLink({
    testId: 'select-wallet-modal-no-wallet-button',
    expectedURL: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    isPopup: true,
  })
})
