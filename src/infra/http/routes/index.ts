import * as fs from 'fs'
import * as path from 'path'
import { HttpRoute } from './http-route'

/**
 * Loads all routes automatically from the routes directory.
 * Scans for files with .route.ts extension and collects HttpRoute instances.
 *
 * @returns {HttpRoute[]} Array of route instances
 */
function loadRoutes(): HttpRoute[] {
  const routes: HttpRoute[] = []
  const routesDir = __dirname

  /**
   * Recursively scans a directory for route files.
   *
   * @param {string} dir - Directory path to scan
   */
  function scanDirectory(dir: string) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (
        stat.isFile() &&
        file.endsWith('.route.ts') &&
        file !== 'index.ts' &&
        file !== 'http-route.ts'
      ) {
        try {
          const relativePath =
            './' + path.relative(routesDir, fullPath).replace(/\.ts$/, '')

          // Dynamically import the module
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const routeModule = require(relativePath)

          Object.keys(routeModule).forEach((key) => {
            const exported = routeModule[key]

            if (exported instanceof HttpRoute) {
              routes.push(exported)
            }
          })
        } catch (error) {
          console.error(`Error loading route ${fullPath}:`, error)
        }
      }
    }
  }

  scanDirectory(routesDir)
  return routes
}

const routes = loadRoutes()
export default routes
