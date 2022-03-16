import {
  buildAngularRoutePath,
  countSlash,
  normalizeCase,
} from '../utils'
import { generateClientCode } from '../stringify'

import type { Optional, ResolvedOptions } from '../types'
import type { PageContext } from '../context'

export interface AngularRouteBase {
  loadChildren?: any
  children?: AngularRouteBase[]
  index?: boolean
  path?: string
  component?: string;
  pathMatch?: 'full' | 'partial'
  rawRoute: string
}

export interface AngularRoute extends Omit<Optional<AngularRouteBase, 'rawRoute' | 'path'>, 'children'> {
  children?: AngularRoute[]
}

function prepareRoutes(
  routes: AngularRoute[],
  options: ResolvedOptions,
  parent?: AngularRoute,
) {
  for (const route of routes) {
    if (parent)
      route.path = route.path?.replace(/^\//, '')

    if (route.children)
      route.children = prepareRoutes(route.children, options, route)

    delete route.rawRoute

    if (route.index)
      delete route.path

    Object.assign(route, options.extendRoute?.(route, parent) || {})
  }

  return routes
}

export async function resolveAngularRoutes(ctx: PageContext) {
  const { routeStyle, caseSensitive } = ctx.options
  const nuxtStyle = routeStyle === 'nuxt'

  const pageRoutes = [...ctx.pageRouteMap.values()]
    // sort routes for HMR
    .sort((a, b) => countSlash(a.route) - countSlash(b.route))
    .sort((a, b) => {console.log(a.path, b.path);
      if (b.path.endsWith('index.ts') || b.path.endsWith('].ts')) {
        return -1
      }

      return 0;
    })    
  
  const routes: AngularRouteBase[] = []
  // console.log(pageRoutes);
  pageRoutes.forEach((page) => {console.log(page.path);
    const pathNodes = page.route.split('/')
    // add leading slash to component path if not already there
    const component = page.path.replace(ctx.root, '')
    let parentRoutes = routes

    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i]

      const route: AngularRouteBase = {
        path: '',
        loadChildren: component,
        rawRoute: pathNodes.slice(0, i + 1).join('/'),
      }

      const isIndexRoute = normalizeCase(node, caseSensitive).endsWith('index')

      if (!route.path && isIndexRoute) {
        route.path = '';
        route.pathMatch = 'full';
      } else if (!isIndexRoute) {
        route.path = buildAngularRoutePath(node, nuxtStyle)
      }

      // Check parent exits
      const parent = parentRoutes.find((parent) => {
        return pathNodes.slice(0, i).join('/') === parent.rawRoute
      })

      if (parent) {
        parent.component = undefined;
        parent.loadChildren = undefined;
        // Make sure children exits in parent
        parent.children = parent.children || []
        // Append to parent's children
        parentRoutes = parent.children || []
      }

      const exits = parentRoutes.some((parent) => {
        return pathNodes.slice(0, i + 1).join('/') === parent.rawRoute
      })
      if (!exits)
        parentRoutes.push(route)
    }
  })

  // sort by dynamic routes
  let finalRoutes = prepareRoutes(routes, ctx.options)
  console.log('fr', JSON.stringify(finalRoutes));

  finalRoutes = (await ctx.options.onRoutesGenerated?.(finalRoutes)) || finalRoutes
  let client = generateClientCode(finalRoutes, ctx.options)
  client = (await ctx.options.onClientGenerated?.(client)) || client
  console.log('cl', client);
  return client
}
