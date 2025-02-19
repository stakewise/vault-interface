import React, { useEffect } from 'react'
import cx from 'classnames'

import Settings from '../Settings/Settings'
import BurgerButton from '../BurgerButton/BurgerButton'

import s from './MenuMobile.module.scss'


type MenuMobileProps = {
  className?: string
  active: boolean
  closeMenu: () => void
}

const MenuMobile: React.FC<MenuMobileProps> = (props) => {
  const { className, active, closeMenu } = props

  useEffect(() => {
    const main = document.querySelector('main')
    const header = document.querySelector('header')
    const footer = document.querySelector('footer')

    if (active) {
      main?.setAttribute('inert', '')
      header?.setAttribute('inert', '')
      footer?.setAttribute('inert', '')
      document.body.classList.add('overflow-hidden')

      return () => {
        main?.removeAttribute('inert')
        header?.removeAttribute('inert')
        footer?.removeAttribute('inert')
        document.body.classList.remove('overflow-hidden')
      }
    }
  }, [ active ])

  return (
    <div
      className={cx(s.menu, className, 'absolute grid top-0 left-0 w-full width-container', {
        [s.hidden]: !active,
      })}
    >
      {
        active && (
          <BurgerButton
            className={cx('absolute top-12 right-24 transition-opacity duration-1000 opacity-0', {
              'opacity-100': active,
            })}
            active
            dataTestId="mobile-menu-close"
            onClick={closeMenu}
          />
        )
      }
      <Settings />
    </div>
  )
}


export default MenuMobile
