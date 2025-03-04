import { IHttpApi } from '../interfaces/http-api.interface'
import express, { Express, Request, Response } from 'express'
import { IHttpRoute } from '../interfaces/http-route.interface'
import { HttpResponse } from '../interfaces/http-response.interface'
import { HttpRequest } from '../interfaces/http-request.interface'

export class ApiExpress implements IHttpApi {
  private app: Express

  private constructor(routes: IHttpRoute[]) {
    this.app = express()
    this.setupRoutes(routes)
  }

  static create(routes: IHttpRoute[]): ApiExpress {
    return new ApiExpress(routes)
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
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
