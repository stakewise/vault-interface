import EventAggregator from '../event-aggregator'


const events = new EventAggregator()

let notifications: Notifications.Notification[] = []
let notificationId = 1

const subscribe: Notifications.Subscribe = (event, handler) => {
  events.subscribe(event, handler)
}

const unsubscribe: Notifications.Unsubscribe = (event, handler) => {
  events.unsubscribe(event, handler)
}

const open: Notifications.OpenNotification = ({ thread, ...props }) => {
  const notification = { id: ++notificationId, thread, props }

  if (thread) {
    const filteredNotifications = notifications.filter((notification) => notification.thread !== thread)

    notifications = [ ...filteredNotifications, notification ]
  }
  else {
    notifications = [ ...notifications, notification ]
  }

  events.dispatch('open', notification, notifications)
}

const close: Notifications.CloseNotification = (id) => {
  const notification = notifications.find((notification) => notification.id === id)

  if (notification) {
    notifications = notifications.filter((notification) => notification.id !== id)

    events.dispatch('close', notification, notifications)
  }
}

const closeAll = (): void => {
  notifications.forEach((notification) => {
    close(notification.id)
  })
}


export {
  open,
  close,
  closeAll,
  subscribe,
  unsubscribe,
  notifications,
}
