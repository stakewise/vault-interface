'use client'
import React from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'
import { useViewportHeight, useImagesPrefetch } from 'hooks'

// import { icons } from 'components'

import {
  useFiatRates,
  useQueryParams,
} from './util'

import s from './AppLayout.module.scss'


const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFiatRates()
  useQueryParams()
  useViewportHeight()
  // useImagesPrefetch(icons)

  const { isMobile } = device.useData()

  return (
    <div
      className={cx(s.container, 'flex flex-col overflow-hidden', {
        'py-40': !isMobile,
        'pt-24 pb-16': isMobile,
      })}
    >
      <main
        className={cx(
          'flex-1 w-full flex relative',
          'ex-mobile:my-60 mobile:my-24'
        )}
      >
        {children}
      </main>
    </div>
  )
}


export default React.memo(AppLayout)
