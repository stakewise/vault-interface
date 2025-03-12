import React from 'react'
import cx from 'classnames'

import { Href , ButtonBase, Logo, LogoName, Text, Loading } from 'components'

import s from './ConnectorButton.module.scss'


type ConnectorButtonProps = {
  className?: string
  title: Intl.Message | string
  logo: LogoName
  isDisabled: boolean
  isLoading: boolean
  deepLink?: string
  dataTestId?: string
  onClick: () => void
}

const ConnectorButton: React.FC<ConnectorButtonProps> = (props) => {
  const { className, title, logo, isDisabled, isLoading, deepLink, dataTestId, onClick } = props

  if (deepLink) {
    return (
      <Href
        to={deepLink}
        className={cx(s.button, className, 'relative flex flex-col items-center')}
        dataTestId={dataTestId}
      >
        <div className={cx(s.logo, 'p-16 rounded-8')}>
          <Logo
            name={logo}
            size={48}
          />
        </div>
        <Text
          className={cx(s.text, 'mt-16 opacity-60')}
          dataTestId={`${dataTestId}-title`}
          message={title}
          color="dark"
          size="t12m"
        />
      </Href>
    )
  }

  return (
    <ButtonBase
      className={cx(s.button, className, 'relative flex-col justify-start')}
      disabled={isDisabled}
      dataTestId={dataTestId}
      onClick={onClick}
    >
      <div className={cx(s.logo, 'p-16 rounded-8')}>
        {
          isLoading ? (
            <div className="p-8">
              <Loading size={32} />
            </div>
          ) : (
            <Logo
              name={logo}
              size={48}
            />
          )
        }
      </div>
      <Text
        className={cx(s.text, 'mt-16 opacity-60')}
        dataTestId={`${dataTestId}-title`}
        message={title}
        color="dark"
        size="t12m"
      />
    </ButtonBase>
  )
}


export default ConnectorButton
