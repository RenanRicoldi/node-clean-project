import { IHttpApi } from '../interfaces/http-api.interface'
import express, { Express, Request, Response } from 'express'
import { IHttpRoute } from '../interfaces/http-route.interface'
import { HttpResponse } from '../interfaces/http-response.interface'
import { HttpRequest } from '../interfaces/http-request.interface'
import { inject, injectable } from 'tsyringe'

/**
 * Express implementation of the HTTP API interface.
 * Handles HTTP requests and responses using Express framework.
 *
 * @implements {IHttpApi}
 */
@injectable()
export class ApiExpress implements IHttpApi {
  /** Express application instance */
  private app: Express

  /**
   * Creates an instance of ApiExpress.
   *
   * @param {IHttpRoute[]} routes - Array of HTTP routes to be registered
   */
  constructor(@inject('Routes') private routes: IHttpRoute[]) {
    this.setupApp()
    this.setupMiddlewares()
    this.setupRoutes(routes)
  }

  /**
   * Initializes the Express application.
   *
   * @private
   */
  private setupApp(): void {
    this.app = express()
  }

  /**
   * Configures Express middlewares for request processing.
   * Sets up JSON body parsing and URL-encoded form data handling.
   *
   * @private
   */
  private setupMiddlewares(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  /**
   * Starts the HTTP server on the specified port.
   *
   * @param {number} port - The port number to listen on
   * @public
   */
  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
      this.listRoutes()
    })
  }

  /**
   * Lists all available routes grouped by domain.
   * Displays HTTP method and path for each route.
   *
   * @public
   */
  public listRoutes(): void {
    console.log('\nAvailable Routes:')
    console.log('-------------------')

    // Group routes by domain for better organization
    const routesByDomain: Record<string, { path: string; method: string }[]> =
      {}

    this.routes.forEach((route) => {
      const domain = route.domain || 'general'
      const path = route.getPath()
      const method = route.method.toUpperCase()

      if (!routesByDomain[domain]) {
        routesByDomain[domain] = []
      }

      routesByDomain[domain].push({ path, method })
    })

    // Display routes grouped by domain
    Object.keys(routesByDomain)
      .sort()
      .forEach((domain) => {
        console.log(`\n🔹 Domain: ${domain}`)

        // Sort routes by path for easier reading
        routesByDomain[domain]
          .sort((a, b) => a.path.localeCompare(b.path))
          .forEach(({ method, path }) => {
            console.log(`  ${method.padEnd(6)} ${path}`)
          })
      })
  }

  /**
   * Registers all routes with the Express application.
   * Maps each route's handler to the corresponding HTTP method and path.
   *
   * @param {IHttpRoute[]} routes - Array of routes to register
   * @private
   */
  private setupRoutes(routes: IHttpRoute[]): void {
    routes.forEach((route) => {
      this.app[route.method](route.getPath(), this.adaptRoute(route.handler))
    })
  }

  /**
   * Adapts a route handler function to an Express middleware.
   * Transforms Express request/response objects to application-specific interfaces.
   *
   * @param {Function} handler - The route handler function that accepts HttpRequest and returns HttpResponse
   * @returns {Function} Express middleware function
   * @private
   */
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
