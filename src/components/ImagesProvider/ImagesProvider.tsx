import React from 'react'
import kit from 'sw-modules/kit-provider'

import imagesUrls from './images'


type ImagesProviderProps = {
  children: React.ReactNode
}

const ImagesProvider: React.FC<ImagesProviderProps> = ({ children }) => {
  const context = kit.useInit({ imagesUrls })

  return (
    <kit.Provider value={context}>
      {children}
    </kit.Provider>
  )
}


export { imagesUrls }

export default ImagesProvider
