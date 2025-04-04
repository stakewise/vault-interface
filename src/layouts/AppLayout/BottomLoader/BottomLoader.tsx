import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createPortal } from 'react-dom'
import { commonMessages } from 'helpers'
import device from 'modules/device'
import { useStore } from 'hooks'

import { RoundButton, Text, Loading } from 'components'

import s from './BottomLoader.module.scss'


const storeSelector = (store: Store) => ({
  bottomLoader: store.ui.bottomLoader,
})

const BottomLoader: React.FC = (): React.ReactPortal | null => {
  const { isDesktop } = device.useData()
  const { bottomLoader } = useStore(storeSelector)
  const loaderRef = useRef<HTMLDivElement>(null)
  const [ data, setData ] = useState<Store['ui']['bottomLoader']>(null)

  useEffect(() => {
    if (bottomLoader?.content) {
      setData(bottomLoader)

      return
    }

    if (loaderRef.current) {
      loaderRef.current.classList.add(s.closed)
      setTimeout(() => setData(null), 300) // For animation
    }
    else {
      setData(null)
    }
  }, [ bottomLoader ])

  if (!data) {
    return null
  }

  const { content, link } = data

  const loaderClassName = cx(s.loader, 'flex items-center px-16 py-8 rounded-12 overflow-hidden relative', {
    'mr-24': isDesktop,
    'mx-12': !isDesktop,
  })

  return createPortal(
    <div
      className={cx(s.container, 'fixed right-0 bottom-24 overflow-hidden', {
        'z-notification': isDesktop,
        'z-menu': !isDesktop, // Should not overlap the buttons in the modal window
      })}
    >
      <div
        ref={loaderRef}
        className={loaderClassName}
      >
        <Loading
          color="dark"
          size={16}
        />
        <Text
          className="ml-16"
          message={content as Intl.Message}
          size="t12m"
          color="dark"
          dataTestId="bottom-loader-text"
        />
        {
          Boolean(link) && (
            <RoundButton
              className="ml-16"
              ariaLabel={commonMessages.accessibility.viewInBlockExplorer}
              icon="icon/link"
              target="_blank"
              color="secondary"
              href={link}
              size={24}
              tag="a"
            />
          )
        }
      </div>
    </div>,
    document.getElementById('bottomLoader') as Element
  ) as React.ReactPortal
}


export default React.memo(BottomLoader)
