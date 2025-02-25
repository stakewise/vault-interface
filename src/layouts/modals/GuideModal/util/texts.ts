import messages from './messages'


const firstSlide = {
  ...messages.common['1'],
  values: {
    linkClassName: 'hover-underline text-ocean',
    url: 'https://aave.com/',
  },
}

const ltv90 = {
  1: firstSlide,
  2: {
    ...messages.common['2'],
    values: {
      eth: '5',
      increase: '6',
    },
  },
  3: messages.common['3'],
  // 4: messages.common['4'],
  // 5: messages.common['5'],
  6: messages.vault['6'],
  7: messages.common['7'],
}

const ltv100 = {
  1: firstSlide,
  2: {
    ...messages.common['2'],
    values: {
      eth: '13',
      increase: '14',
    },
  },
  3: messages.common['3'],
  // 4: messages.common['4'],
  // 5: messages.common['5'],
  6: messages.vault['6'],
  7: messages.common['7'],
}

const stakePage = {
  ...ltv100,
  6: messages.stake['6'],
}


export default {
  ltv90,
  ltv100,
  stakePage,
}
