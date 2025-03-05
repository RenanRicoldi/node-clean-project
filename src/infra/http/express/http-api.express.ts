import { IHttpApi } from '../interfaces/http-api.interface'
import express, { Express, Request, Response } from 'express'
import { IHttpRoute } from '../interfaces/http-route.interface'
import { HttpResponse } from '../interfaces/http-response.interface'
import { HttpRequest } from '../interfaces/http-request.interface'
import { inject, injectable } from 'tsyringe'

@injectable()
export class ApiExpress implements IHttpApi {
  private app: Express

  constructor(@inject('Routes') private routes: IHttpRoute[]) {
    this.setupApp()
    this.setupMiddlewares()
    this.setupRoutes(routes)
  }

  private setupApp(): void {
    this.app = express()
  }

  private setupMiddlewares(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
      this.listRoutes()
    })
  }

  public listRoutes(): void {
    console.log('\nAvailable Routes:')
    console.log('-------------------')

    // Agrupa rotas por domínio para melhor organização
    const routesByDomain: Record<string, { path: string; method: string }[]> =
      {}

    this.routes.forEach((route) => {
      const domain = route.domain || 'geral'
      const path = route.getPath()
      const method = route.method.toUpperCase()

      if (!routesByDomain[domain]) {
        routesByDomain[domain] = []
      }

      routesByDomain[domain].push({ path, method })
    })

    // Exibe as rotas agrupadas por domínio
    Object.keys(routesByDomain)
      .sort()
      .forEach((domain) => {
        console.log(`\n🔹 Domain: ${domain}`)

        // Ordena as rotas por caminho para facilitar a leitura
        routesByDomain[domain]
          .sort((a, b) => a.path.localeCompare(b.path))
          .forEach(({ method, path }) => {
            console.log(`  ${method.padEnd(6)} ${path}`)
          })
      })
  }

  private setupRoutes(routes: IHttpRoute[]): void {
    routes.forEach((route) => {
      this.app[route.method](route.getPath(), this.adaptRoute(route.handler))
    })
  }

  private adaptRoute(
    handler: (httpRequest: HttpRequest) => HttpResponse | Promise<HttpResponse>,
  ) {
    return async (req: Request, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query as Record<string, string | string[]>,
        headers: req.headers as Record<string, string>,
      }

      const httpResponse = await handler(httpRequest)

      res.status(httpResponse.status).json(httpResponse.body)
    }
  }
}
