import React, { useEffect, useMemo, useCallback, Fragment, useId, useRef } from 'react'
import cx from 'classnames'
import intl from 'modules/intl'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import ButtonBase from '../ButtonBase/ButtonBase'
import Counter from '../Counter/Counter'
import Text from '../Text/Text'

import s from './TabsView.module.scss'


export type TabsViewProps = {
  className?: string
  panelClassName?: string
  panelsClassName?: string
  selectedId?: string
  tabsList: {
    id: string
    title: Intl.Message | string
    disabled?: boolean
    dataTestId?: string
    counter?: number
    isError?: boolean
    isCounterFetching?: boolean
  }[]
  noteNode?: React.ReactNode
  defaultActiveTabId?: string
  borderMin?: boolean
  onChange?: (id: string) => void
  children: React.ReactNode | ((props: { id: string }) => React.ReactNode)
}

const TabsView: React.FC<TabsViewProps> = (props) => {
  const {
    children, className, panelClassName, panelsClassName,
    tabsList, selectedId, defaultActiveTabId, borderMin,
    noteNode, onChange,
  } = props

  const id = useId()
  const lineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { locale } = intl.useIntl()

  const defaultIndex = useMemo(() => {
    if (defaultActiveTabId) {
      return tabsList.findIndex(({ id }) => id === defaultActiveTabId)
    }

    return 0
  }, [ tabsList, defaultActiveTabId ])

  const selectedIndex = useMemo(() => {
    if (selectedId) {
      return tabsList.findIndex(({ id }) => id === selectedId)
    }
  }, [ tabsList, selectedId ])

  const handleLine = useCallback((selectedIndex: number = 0) => {
    const element = document.querySelector<HTMLButtonElement>(`[data-id="tab-${id}-${selectedIndex}"]`)

    if (element && lineRef.current && containerRef.current) {
      const tabWidth = element.offsetWidth
      const { x: tabX } = element.getBoundingClientRect()
      const { x: containerX } = containerRef.current.getBoundingClientRect()

      const leftPosition = tabX - containerX

      lineRef.current.style.width = `${tabWidth}px`
      lineRef.current.style.left = `${leftPosition}px`

      if (element.dataset['error'] === 'true') {
        lineRef.current.classList.replace('bg-primary', 'bg-error')
      }
      else {
        lineRef.current.classList.replace('bg-error', 'bg-primary')
      }
    }
  }, [ id ])

  const handleChange = useCallback((index: number) => {
    handleLine(index)

    if (typeof onChange === 'function') {
      const selectedId = tabsList[index]?.id

      onChange(selectedId as string)
    }
  }, [ tabsList, onChange ])

  useEffect(() => {
    handleLine(selectedIndex)
  }, [ tabsList, selectedIndex, locale ])

  return (
    <div className={className}>
      <TabGroup
        className="flex flex-col flex-1"
        defaultIndex={selectedIndex || defaultIndex}
        selectedIndex={selectedIndex}
        onChange={handleChange}
        manual
      >
        <div
          className={cx(s.tabList, 'flex relative', {
            [s.borderMin]: borderMin,
            [s.borderFill]: !borderMin,
          })}
          ref={containerRef}
        >
          <div
            className={cx(s.line, 'bg-primary')}
            ref={lineRef}
          />
          <TabList
            className={cx({
              'flex-1': !borderMin,
            })}
          >
            {
              tabsList.map((tab, index) => {
                const { id: itemId, title, dataTestId, disabled, counter, isError, isCounterFetching } = tab

                return (
                  <Tab
                    key={itemId}
                    as={Fragment}
                  >
                    {
                      ({ selected }) => {
                        const defaultClassName = cx({
                          'text-dark': selected,
                          'text-secondary': disabled,
                          'interaction-color-secondary': !selected,
                        })

                        const errorClassName = cx({
                          'text-error': selected,
                          'interaction-color-error': !selected,
                        })

                        return (
                          <ButtonBase
                            className={cx('relative', {
                              'ml-24': index,
                              [errorClassName]: !disabled && isError,
                              [defaultClassName]: !isError,
                            })}
                            tag="button"
                            data-id={`tab-${id}-${index}`}
                            data-error={isError}
                            disabled={disabled}
                            dataTestId={dataTestId}
                          >
                            <Text
                              className={cx('py-12', s.tabTitle)}
                              message={title}
                              size="t14m"
                              color="inherit"
                            />
                            {
                              Boolean(counter || isCounterFetching) && (
                                <Counter
                                  className="ml-8"
                                  count={counter as number}
                                  disabled={disabled}
                                  isFetching={isCounterFetching}
                                />
                              )
                            }
                          </ButtonBase>
                        )
                      }
                    }
                  </Tab>
                )
              })
            }
          </TabList>
          {
            Boolean(noteNode) && (
              <div
                className={cx({
                  'flex-1 flex justify-end': borderMin,
                })}
              >
                {noteNode}
              </div>
            )
          }
        </div>
        <TabPanels className={panelsClassName}>
          {
            tabsList.map(({ id }) => (
              <TabPanel className={panelClassName} key={id}>
                {
                  typeof children === 'function'
                    ? children({ id })
                    : children
                }
              </TabPanel>
            ))
          }
        </TabPanels>
      </TabGroup>
    </div>
  )
}


export default React.memo(TabsView)
