import generateAbsoluteLinks from './generateAbsoluteLinks'
import generateRouteMeta from './generateRouteMeta'

import base from './base'


const absoluteLinks = generateAbsoluteLinks(base)
const linksMeta = generateRouteMeta(base)


export { linksMeta }

export default absoluteLinks
