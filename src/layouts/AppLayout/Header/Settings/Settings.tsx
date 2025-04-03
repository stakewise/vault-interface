import React from 'react'
import cx from 'classnames'
import device from 'modules/device'
import { commonMessages } from 'helpers'

import { Button, MenuDropdown , MenuDropdownProps } from 'components'

import useAppConfig from './util/useAppConfig'


type SettingsProps = {
  className?: string
}

const Settings: React.FC<SettingsProps> = ({ className }) => {
  const { isMobile } = device.useData()

  const settingsOptions = useAppConfig()

  console.log({ settingsOptions })
  if (isMobile) {
    return (
      <div
        className={cx(className, 'flex items-center justify-center gap-32')}
      >
        {
          settingsOptions.map((settingsOption, index) => {
            const { value, options, dataTestId, ariaLabel, onChange } = settingsOption

            const selectedOption = options?.find((option: MenuDropdownProps['options'][number]) => option.value === value)
            const position = [ 'top-start', 'top-center', 'top-end' ][index]

            return (
              <MenuDropdown
                key={index}
                dataTestId={dataTestId}
                placement={position as MenuDropdownProps['placement']}
                button={(
                  <Button
                    className="rounded-full"
                    color="light"
                    ariaLabel={ariaLabel}
                    icon={selectedOption?.icon}
                    logo={selectedOption?.logo}
                    dataTestId={`${dataTestId}-button`}
                  />
                )}
                options={options as MenuDropdownProps['options']}
                onChange={onChange}
              />
            )
          })
        }
      </div>
    )
  }

  return (
    <MenuDropdown
      className={className}
      options={settingsOptions}
      placement="bottom-end"
      button={(
        <Button
          icon="icon/gear"
          color="light"
          dataTestId="settings-toggle-button"
          ariaLabel={commonMessages.accessibility.openSettings}
        />
      )}
    />
  )
}


export default React.memo(Settings)
