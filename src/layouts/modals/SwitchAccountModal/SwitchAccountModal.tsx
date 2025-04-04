import React from 'react'
import modal from 'modules/modal'
import { commonMessages } from 'helpers'

import { Bone, Text, Modal, ButtonBase } from 'components'

import AccountItem from './AccountItem/AccountItem'
import useSwitchAccount from './util/useSwitchAccount'

import messages from './messages'


export const [ SwitchAccountModal, openSwitchAccountModal ] = (
  modal.wrapper(UNIQUE_FILE_ID, (props) => {
    const { closeModal } = props

    const {
      address,
      accounts,
      isFetching,
      nextPathType,
      onSelectAddress,
      onChangePathType,
    } = useSwitchAccount(closeModal)

    return (
      <Modal
        title={messages.title}
        closeModal={closeModal}
        size="narrow"
      >
        <div className="grid grid-cols-2 gap-16">
          {
            isFetching ? (
              [ ...new Array(6) ].map((_, index) => (
                <Bone
                  key={index}
                  delay={1}
                  w={208}
                  h={124}
                />
              ))
            ) : (
              accounts.map((account, index) => (
                <AccountItem
                  key={index}
                  address={account}
                  isActive={account === address}
                  onClick={onSelectAddress}
                />
              ))
            )
          }
        </div>
        <div className="flex items-center justify-center mt-24">
          {
            isFetching ? (
              <Text
                className="opacity-60"
                message={commonMessages.loading}
                color="dark"
                size="t14"
              />
            ) : (
              <>
                <Text
                  className="opacity-60"
                  message={messages.note}
                  color="dark"
                  tag="span"
                  size="t14"
                />
                &nbsp;
                <ButtonBase
                  type="button"
                  onClick={() => onChangePathType(nextPathType.type)}
                >
                  <Text
                    message={nextPathType.title}
                    color="primary"
                    tag="span"
                    size="t14"
                  />
                </ButtonBase>
              </>
            )
          }
        </div>
      </Modal>
    )
  })
)
