import type { AllHTMLAttributes, AriaAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react'


const microDataAttrs = [
  'itemID', 'itemProp', 'itemRef', 'itemScope', 'itemType',
] as const

const selectAttrs = [
  'autoComplete', 'disabled', 'multiple', 'required',
] as const

const inputAttrs = [
  ...selectAttrs,
  'enterKeyHint', 'inputMode', 'list', 'min', 'max', 'readOnly', 'step', 'type',
] as const

const commonAttributes = [
  'accessKey', 'autoFocus', 'hidden', 'lang', 'name', 'role', 'spellCheck', 'style', 'tabIndex', 'translate', 'title',
] as const

type Role = {
  role?: (
    // Widget Roles
    'alert' | 'button' | 'checkbox' | 'combobox' | 'dialog' | 'grid' | 'gridcell' | 'link' | 'listbox' | 'log'
    | 'marquee' | 'menu' | 'menubar' | 'menuitem' | 'option' | 'progressbar' | 'radio' | 'radiogroup'
    | 'scrollbar' | 'slider' | 'status' | 'tab' | 'tabpanel' | 'textbox' | 'timer' | 'tooltip' | 'tree' | 'treeitem'
    // Document Structure Roles
    | 'document' | 'article' | 'definition' | 'directory' | 'group' | 'heading' | 'img'
    | 'list' | 'listitem' | 'region' | 'row' | 'toolbar' | 'note'
    // Landmark Roles
    | 'application' | 'banner' | 'complementary' | 'contentinfo'
    | 'form' | 'main' | 'navigation' | 'search'
    )
}

type CommonAttrs = (
  Pick<AllHTMLAttributes<any>, typeof microDataAttrs[number]>
  & Pick<AllHTMLAttributes<any>, typeof commonAttributes[number]>
  & AriaAttributes
  & Role
  & {
  // you can use any data-* but it's here for the IDE autocomplete
  'data-testid'?: string
}
  )

type Attrs = {
  HTMLInputElement: Pick<InputHTMLAttributes<HTMLInputElement>, typeof inputAttrs[number]>
  HTMLSelectElement: Pick<SelectHTMLAttributes<HTMLSelectElement>, typeof selectAttrs[number]>
  default: {}
}

export type GlobalHtmlAttributes<T extends keyof Attrs = 'default'> = CommonAttrs & Attrs[T]

const getGlobalHtmlAttrs = (props: Record<string, any>) => (
  Object.keys(props).reduce((attrs, key) => {
    if (
      // Aria
      key.indexOf('aria-') === 0
      // Data
      || key.indexOf('data-') === 0
      // Listeners
      || key.indexOf('on') === 0
      // Micro-data
      || microDataAttrs.includes(key as typeof microDataAttrs[number])
      // Input specific attributes
      || inputAttrs.includes(key as typeof inputAttrs[number])
      // common attributes
      || commonAttributes.includes(key as typeof commonAttributes[number])
    ) {
      attrs[key] = props[key]
    }

    return attrs
  }, {} as Record<string, any>)
)


export default getGlobalHtmlAttrs
