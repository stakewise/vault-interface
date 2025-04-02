import React from 'react'
import forms from 'modules/forms'

import TabsView, { TabsViewProps } from '../TabsView/TabsView'


export type TabsProps = Omit<TabsViewProps, 'defaultActiveTabId' | 'selectedId' | 'onChange'> & {
  field: Forms.Field<string>
  panelClassName?: string
  panelsClassName?: string
}

const Tabs: React.FC<TabsProps> = (props) => {
  const {
    className,
    panelClassName,
    panelsClassName,
    field,
    tabsList,
    noteNode,
    borderMin,
    children,
  } = props

  const { value } = forms.useFieldValue(field)

  if (!field.isString) {
    throw new Error('Tabs should work with string field')
  }

  return (
    <TabsView
      className={className}
      panelsClassName={panelsClassName}
      panelClassName={panelClassName}
      selectedId={value}
      tabsList={tabsList}
      noteNode={noteNode}
      borderMin={borderMin}
      onChange={(value: string) => field.setValue(value)}
    >
      {children}
    </TabsView>
  )
}


export default React.memo(Tabs)
