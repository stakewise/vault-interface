import React from 'react'


// <Button boolAttr1 valueAttr1="/queue" valueAttr2=" value " emptyAttr="" boolAttr2>content</Button>
export const getComponentProps = (message: string): Record<string, any> | undefined => {
  const props: Record<string, any> = {}

  if (/<\w+\s*\/>/.test(message)) {
    return
  }

  const attrsPart = message
    // leave only part with attributes - 'boolAttr1 valueAttr1="/queue" valueAttr2=" value " emptyAttr="" boolAttr2'
    .replace(/^<\w+\s+([^>]+?)\/?>.*/, '$1')
    // strip spaces around `=`
    .replace(/\s*=\s*/g, '=')

  // to match all empty attributes with regex too complex, so
  const emptyProps = (
    attrsPart
      .replace(/\w+\s*=\s*["'].*?["']/g, '') // strip attributes with values - 'boolAttr1    boolAttr2'
      .trim()
      .split(/\s+/g) // split empty attributes - [ 'boolAttr1', 'boolAttr2' ]
  )

  emptyProps.forEach((prop) => {
    if (prop) {
      props[prop] = true
    }
  })

  // [ 'valueAttr1="/queue"', 'valueAttr2=" value "', 'emptyAttr=""' ]
  const valuedProps = attrsPart.trim().match(/\w+\s*=\s*['"][^"]*?['"]/g)

  valuedProps?.forEach((match) => {
    // class="test" || class='test' || class=\test\
    let [ key, value ] = match.trim().split(/=(?=["'\\])/) as [ any, any ]

    if (value) {
      value = value.replace(/['"]/g, '')
    }

    if (value === 'true') {
      value = true
    }
    else if (value === 'false') {
      value = false
    }

    props[key] = value
  })

  return props
}

export const getComponentChildren = (message: string): string | undefined => {
  const componentName = message.match(/<(\w+)/)?.[1]

  // <Icon />
  if (/^<[^>]+\/>$/.test(message)) {
    return
  }

  // <Link to="/">bar</Link>
  // complex regex to be sure that value be matched properly even if the content is "< apple>banana<grape>"
  return message.match(new RegExp(`<\\s*${componentName}[^>]+?>(.*)<\/\\s*${componentName}\\s*>`))?.[1]
}

export const createComponent = (message: string, components: Record<string, any>): React.ReactElement | undefined => {
  try {
    const componentName = message.match(/<(\w+)/)?.[1] as string
    const component = components[componentName] || componentName
    const props = getComponentProps(message)
    const children = getComponentChildren(message)

    return React.createElement(component, props, children)
  }
  catch (err) {
    console.error(err)
  }
}

/**
 * Replace components in string message with components create with React.createElement
 *
 * message: "foo <Link to="/">bar</Link> zoo <Icon /> baz <Button>kek</Button>"
 * components: { Link: Link, Icon: Icon, Button: Button }
 *
 * result:
 *
 * [
 *   "foo ",
 *   React.createElement(Link, { to: '/' }, 'bar'),
 *   " zoo ",
 *   React.createElement(Icon),
 *   " baz ",
 *   "<Href>kek</Href>",
 * ]
 */
const replaceReactComponents = (message: string, components: Record<string, React.FC<any>>): any[] => {
  const componentNames = Object.keys(components || {})
  const elementNames = [ 'span', 'div', 'br', 'a' ]

  // if (!componentNames.length) {
  //   return [ message ]
  // }

  const compoRegexStr = componentNames.join('|') // Link|Icon|Button
  const elementRegexStr = elementNames.join('|') // span|div|br|a
  const splitRegexStr = `${componentNames}|${elementRegexStr}` // Link|Icon|Button|span|div|br|a
  const splitRegex = new RegExp(`(<\\s*(?:${splitRegexStr})(?:[^>]+?\/>|.+?(?:${splitRegexStr}\\s*)>))`, 'g')

  let messageArr = message.split(splitRegex)

  const componentRegExp = new RegExp(`<(${compoRegexStr})`)
  const elementRegExp = new RegExp(`<(${elementRegexStr})`)

  return (
    messageArr
      .map((message) => {
        // check that this message part contains a component
        if (componentRegExp.test(message)) {
          return createComponent(message, components)
        }

        if (elementRegExp.test(message)) {
          return createComponent(message, { span: 'span', div: 'div', br: 'br', a: 'a' })
        }

        return message
      })
      .filter((v) => v)
  )
}


export default replaceReactComponents
