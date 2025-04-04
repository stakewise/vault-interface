import React from 'react'
import cx from 'classnames'
import { createPortal } from 'react-dom'
import notifications from 'modules/notifications'

import { Notification } from 'components'

import s from './Notifications.module.scss'


const Notifications = () => createPortal(
  <notifications.Controller
    className={cx(s.notifications, 'fixed z-notification text-center h-0 top-0 mt-4')}
    component={Notification}
  />,
  document.getElementById('notifications') as Element
) as React.ReactPortal


export default React.memo(Notifications)
