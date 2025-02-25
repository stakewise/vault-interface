import React, { useCallback } from 'react'
import cx from 'classnames'
import { analytics, commonMessages } from 'helpers'

import { Icon, IconName , Href } from 'components'

import s from './SocialLinks.module.scss'


type SocialLinksProps = {
  className?: string
  onClick?: () => void
}

type Link = {
  link: string,
  icon: IconName,
  dataTestId: string,
  ariaLabel: string | Intl.Message
}

const links: Link[] = [
  {
    icon: 'social/telegram',
    link: 'https://t.me/stakewise_io',
    dataTestId: 'header-link-telegram',
    ariaLabel: commonMessages.accessibility.goToTelegram,
  },
  {
    icon: 'social/twitter',
    link: 'https://x.com/stakewise_io',
    dataTestId: 'header-link-twitter',
    ariaLabel: commonMessages.accessibility.goToTwitter,
  },
  {
    icon: 'social/discord',
    link: 'https://discord.gg/2BSdr2g',
    dataTestId: 'header-link-discord',
    ariaLabel: commonMessages.accessibility.goToDiscord,
  },
]

const SocialLinks: React.FC<SocialLinksProps> = (props) => {
  const { className, onClick } = props

  return (
    <div className={cx(className, 'flex gap-16')}>
      {
        links.map(({ icon, link, dataTestId, ariaLabel }, index) => (
          <Href
            key={index}
            className={s.link}
            to={link}
            ariaLabel={ariaLabel}
            dataTestId={dataTestId}
            onClick={onClick}
          >
            <Icon
              name={icon}
              color="moon"
              size={24}
            />
          </Href>
        ))
      }
    </div>
  )
}


export default React.memo(SocialLinks)
