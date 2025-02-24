import React from 'react'
import { commonMessages } from 'helpers'
import device from 'sw-modules/device'
import { useModalClose } from 'hooks'
import modal from 'sw-modules/modal'

import { Input, Modal, Select, FormValid, Button } from 'components'

import { useExport, UseExportInput, formatOptions } from './util'
import messages from './messages'


export type ExportRewardsModalProps = Omit<UseExportInput, 'closeModal'>

export const [ ExportRewardsModal, openExportRewardsModal ] = (
  modal.wrapper<ExportRewardsModalProps>(UNIQUE_FILE_ID, (props) => {
    const { vaultAddress, statsType, closeModal } = props

    const { isDesktop } = device.useData()

    const { form, isFetching, onSubmit } = useExport({
      statsType,
      vaultAddress,
      closeModal,
    })

    useModalClose({ closeModal })

    return (
      <Modal
        contentClassName="flex flex-col"
        title={messages.title}
        size="narrow"
        isOverlayDisabled={isFetching}
        closeModal={closeModal}
      >
        <div className="flex flex-1 flex-col h-full gap-32">
          <Input
            label={messages.fromDate}
            field={form.fields.from}
            dataTestId="export-rewards-from-input"
          />
          <Input
            label={messages.toDate}
            field={form.fields.to}
            dataTestId="export-rewards-to-input"
          />
          <Select
            placement="bottom-end"
            options={formatOptions}
            field={form.fields.format}
            label={messages.formatTitle}
            dataTestId="export-rewards-format-select"
          />
          <FormValid form={form}>
            {
              (isValid) => (
                <div className="flex flex-col justify-end flex-1">
                  <Button
                    fullWidth
                    disabled={!isValid}
                    loading={isFetching}
                    size={isDesktop ? 'l' : 'm'}
                    dataTestId="export-rewards-download-button"
                    title={commonMessages.buttonTitle.download}
                    onClick={onSubmit}
                  />
                </div>
              )
            }
          </FormValid>
        </div>
      </Modal>
    )
  })
)
