import { openModal, closeModal } from './manager'
import modalVisibility from './modalVisibility'


const modalWrapper = <Props extends {}>(
  modalName: string,
  ModalComponent: Modals.ModalComponent<Props>
): [ Modals.WrappedComponent<Props>, (props?: Props) => void, () => void ] => {
  const handleOpenModal = (props?: Props) => openModal<Props>(modalName, props)
  const handleCloseModal = () => closeModal(modalName)

  return [
    modalVisibility(modalName, ModalComponent),
    handleOpenModal,
    handleCloseModal,
  ]
}


export default modalWrapper
