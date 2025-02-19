'use client'
import React from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'
import { useViewportHeight, useImagesPrefetch } from 'hooks'

import { imagesUrls } from 'components'

import Header from './Header/Header'

import {
  useFiatRates,
  useQueryParams,
} from './util'

import s from './AppLayout.module.scss'


const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFiatRates()
  useQueryParams()
  useViewportHeight()
  useImagesPrefetch(imagesUrls)

  return (
    <div
      className={cx(s.container, 'flex flex-col overflow-y-hidden')}
    >
      <Header />
      <main className="flex-1 w-full flex">
        {children}
      </main>
    </div>
  )
}


export default React.memo(AppLayout)
