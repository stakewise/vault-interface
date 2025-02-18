import React from 'react'

import createIntl from './createIntl'


const Context = React.createContext<ReturnType<typeof createIntl>>({
  locale: 'en',
  setLocale: () => {},
  formatMessage: () => '',
})


export default Context
