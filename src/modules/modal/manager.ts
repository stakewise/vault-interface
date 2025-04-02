import EventAggregator from '../event-aggregator'


const events = new EventAggregator()
const modals: { [name: string]: boolean } = {}
const waitingModals: { [key: string]: any } = {}

const subscribe = <Props extends {}>(modalName: string, handler: Modals.SubscribeHandler<Props>) => {
  const modalExists = modals[modalName] !== undefined

  if (modalExists) {
    console.error(`Multiple modals with same name: ${modalName}`)

    return
  }

  modals[modalName] = false
  events.subscribe(modalName, handler)

  if (modalName in waitingModals) {
    // if there is an unopened modal, open it
    openModal(modalName, waitingModals[modalName])
  }
}

const unsubscribe = <Props extends {}>(modalName: string, handler: Modals.SubscribeHandler<Props>) => {
  delete modals[modalName]
  events.unsubscribe(modalName, handler)
}

const openModal = <Props extends {}>(modalName: string, props?: Props) => {
  if (modals[modalName] === undefined) {
    // sometimes openModal can be called before modal component initialization.
    // We need to save the event and immediately after initializing the component, open the modal
    waitingModals[modalName] = props
    return
  }

  modals[modalName] = true
  delete waitingModals[modalName]
  events.dispatch(modalName, true, props)
  document.body.style.overflow = 'hidden'
}

const closeModal = (modalName: string): void => {
  if (modals[modalName] === undefined) {
    console.warn(`You are trying to close a modal "${modalName}", but it is already unmounted`)
    return
  }

  modals[modalName] = false
  events.dispatch(modalName, false)
  document.body.style.overflow = ''
}

const getModals = () => modals

export {
  subscribe,
  unsubscribe,
  openModal,
  closeModal,
  getModals,
}
