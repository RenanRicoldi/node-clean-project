import fs from 'fs'
import path from 'path'
import { HttpRoute } from './http-route'

/**
 * Carrega todas as rotas automaticamente
 * @returns Array de rotas
 */
function loadRoutes(): HttpRoute[] {
  const routes: HttpRoute[] = []
  const routesDir = __dirname

  // Função recursiva para percorrer diretórios
  function scanDirectory(dir: string) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      // Se for diretório, percorre recursivamente
      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      }
      // Se for arquivo .ts (exceto index.ts e http-route.ts)
      else if (
        stat.isFile() &&
        file.endsWith('.route.ts') &&
        file !== 'index.ts' &&
        file !== 'http-route.ts'
      ) {
        try {
          // Caminho relativo para require
          const relativePath =
            './' + path.relative(routesDir, fullPath).replace(/\.ts$/, '')

          // Importa o módulo dinamicamente

          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const routeModule = require(relativePath)

          // Verifica todas as exportações do módulo
          Object.keys(routeModule).forEach((key) => {
            const exported = routeModule[key]

            // Verifica se é uma instância de HttpRoute
            if (exported instanceof HttpRoute) {
              routes.push(exported)
            }
          })
        } catch (error) {
          console.error(`Erro ao carregar rota ${fullPath}:`, error)
        }
      }
    }
  }

  // Inicia o escaneamento
  scanDirectory(routesDir)
  return routes
}

// Exporta todas as rotas carregadas automaticamente
const routes = loadRoutes()
export default routes
