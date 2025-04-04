declare global {

  namespace Modals {

    type VisibilityProps = {
      closeModal: () => void
    }

    type WrappedComponent<Props> = React.FC<Partial<Props>>
    type ModalComponent<Props> = React.FC<Props & VisibilityProps>
    type SubscribeHandler<Props extends {}> = (isVisible: boolean, props?: Props) => void
  }
}


import wrapper from './modalWrapper'
import { closeModal, getModals } from './manager'


export default {
  wrapper,
  closeModal,
  getModals,
}
