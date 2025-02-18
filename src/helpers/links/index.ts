import { generateAbsoluteLinks, generateRouteMeta } from 'sw-helpers/links'

import base from './base'


const absoluteLinks = generateAbsoluteLinks(base)
const linksMeta = generateRouteMeta(base)


export { linksMeta }

export default absoluteLinks
