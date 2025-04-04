const generateRouteMeta = (links: Links.Links): Links.RouteMeta => {
  const routesData: Links.RouteMeta = {}

  const getRouteData = (link: Links.Links[string], rootData?: Links.Link) => {
    if (link.title) {
      const path = link.domain
        ? `${link.domain}${rootData?.path ? '/' : ''}${rootData?.path || ''}/${link.path}`
        : `${rootData?.path ? '/' : ''}${rootData?.path || ''}/${link.path}`

      routesData[path] = link.title as Intl.Message
    }
    else if ('root' in link) {
      Object.keys(link).map((key) => {
        const isRoot = key === 'root'

        getRouteData(link[key], isRoot ? undefined : link.root)
      })
    }
    else {
      console.error('No root', link)
    }
  }

  Object.keys(links).forEach((key) => {
    getRouteData(links[key])
  })

  return routesData
}


export default generateRouteMeta
