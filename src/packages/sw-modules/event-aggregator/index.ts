class Event {

  private handlers: Array<Function> = []

  addHandler(handler: Function) {
    this.handlers.push(handler)
  }

  removeHandler(handler: Function) {
    this.handlers = this.handlers.filter((value) => value !== handler)
  }

  resetHandlers() {
    this.handlers.length = 0
  }

  call(...eventArgs: Array<any>) {
    this.handlers.forEach((handler) => {
      try {
        handler(...eventArgs)
      }
      catch (err) {
        console.error(err)
      }
    })
  }
}

class EventAggregator {

  private events: { [key: string]: Event } = {}

  getEvent(name: string): Event {
    let event = this.events[name]

    if (!event) {
      event = new Event()
      this.events[name] = event
    }

    return event
  }

  subscribe(name: string, handler: Function): { event: Event, handler: Function } {
    const event = this.getEvent(name)

    event.addHandler(handler)

    return { event, handler }
  }

  unsubscribe(eventName: string, handler: Function) {
    const event = this.getEvent(eventName)

    event.removeHandler(handler)
  }

  dispatch(name: string, ...eventArgs: Array<any>) {
    const event = this.getEvent(name)

    if (event) {
      event.call(...eventArgs)
    }
  }
}


export default EventAggregator
