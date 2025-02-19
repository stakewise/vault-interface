import React, { useState } from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'

import Connect from './Connect/Connect'
import Settings from './Settings/Settings'
import MenuMobile from './MenuMobile/MenuMobile'
import BurgerButton from './BurgerButton/BurgerButton'


const Header: React.FC = () => {
  const { isMobile } = device.useData()

  const headerClassName = 'width-container flex items-center justify-end py-12'

  const [ active, setActive ] = useState(false)

  if (isMobile) {
    return (
      <>
        <header
          className={cx(headerClassName, {
            'z-header': !active,
          })}
          data-testid="mobile-header-container"
        >
          <div className="flex-1 flex justify-end">
            <Connect />
            <BurgerButton
              className="ml-8"
              active={active}
              dataTestId="burger-button"
              onClick={() => setActive(!active)}
            />
          </div>
        </header>
        <MenuMobile
          active={active}
          closeMenu={() => setActive(false)}
        />
      </>
    )
  }

  return (
    <header
      className={headerClassName}
      data-testid="header-container"
    >
      <div className="flex items-center">
        <Connect />
        <Settings className="ml-8" />
      </div>
    </header>
  )
}

export default React.memo(Header)
