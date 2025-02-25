declare namespace TokenTransactionsModal {

  type Transaction = {
    amount: {
      isExpenses: boolean
      token: Extract<Tokens, 'SWISE' | 'osETH' | 'osGNO'>
      value: string
    }
    hash: {
      link: string;
      text: string
    }
    sender: Intl.Message | string
    recipient: Intl.Message | string
    timestamp: number
  }
}
