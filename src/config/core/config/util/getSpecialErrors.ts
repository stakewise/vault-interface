import messages from '../../messages'


const getSpecialErrors = (error: any) => {
  const errorMessage = typeof error === 'string' ? error : error.message

  if (/no ethereum provider/i.test(errorMessage)) {
    return messages.connectErrors.noProvider
  }

  if (/user rejected the request/i.test(errorMessage)) {
    return messages.connectErrors.authorize
  }

  if (/method wallet_switchEthereumChain not found/i.test(errorMessage)) {
    return messages.connectErrors.switchError
  }

  if (/method wallet_addEthereumChain not found/i.test(errorMessage)) {
    return messages.connectErrors.addError
  }

  if (/unsupported chain id/i.test(errorMessage)) {
    return messages.connectErrors.chainIdError
  }

  if (errorMessage === 'User denied account authorization') {
    return messages.connectErrors.authorize
  }

  if (error && typeof error === 'object') {
    const errorMessage = (error as Error)?.message

    if (error.name === 'EthAppPleaseEnableContractData') {
      return messages.connectErrors.ledger.settings
    }

    if (error.name === 'TransportStatusError') {
      const statusCode = error.statusCode
      const isNotOpened = statusCode === 0x650f || statusCode === 0x6511

      return isNotOpened
        ? messages.connectErrors.ledger.notOpened
        : messages.connectErrors.ledger.lock
    }

    const isNotConnected = (
      errorMessage.indexOf('0x6804') !== -1
      || errorMessage.indexOf('U2F DEVICE_INELIGIBLE') !== -1
    )

    if (isNotConnected) {
      return messages.connectErrors.ledger.notConnected
    }
  }

  return null
}


export default getSpecialErrors
