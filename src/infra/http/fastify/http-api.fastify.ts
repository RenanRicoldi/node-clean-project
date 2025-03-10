import { IHttpApi } from '../interfaces/http-api.interface'
import { IHttpRoute } from '../interfaces/http-route.interface'
import { HttpRequest } from '../interfaces/http-request.interface'
import { HttpResponse } from '../interfaces/http-response.interface'
import { inject, injectable } from 'tsyringe'
import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  HTTPMethods,
} from 'fastify'

/**
 * Fastify implementation of the HTTP API interface.
 * Handles HTTP requests and responses using Fastify framework.
 *
 * @implements {IHttpApi}
 */
@injectable()
export class ApiFastify implements IHttpApi {
  /** Fastify server instance */
  private server: FastifyInstance

  /**
   * Creates an instance of ApiFastify.
   *
   * @param {IHttpRoute[]} routes - Array of HTTP routes to be registered
   */
  constructor(@inject('Routes') private readonly routes: IHttpRoute[]) {
    this.setupServer()
    this.setupMiddlewares()
    this.setupRoutes(routes)
    this.setupErrorHandling()
  }

  /**
   * Initializes the Fastify server.
   *
   * @private
   */
  private setupServer(): void {
    this.server = fastify({
      logger: false,
      ajv: {
        customOptions: {
          removeAdditional: 'all',
          coerceTypes: true,
          useDefaults: true,
        },
      },
    })
  }

  /**
   * Configures Fastify middlewares for request processing.
   *
   * @private
   */
  private setupMiddlewares(): void {
    // Register content-type parsers
    this.server.addContentTypeParser(
      'application/json',
      { parseAs: 'string' },
      (
        _req: FastifyRequest,
        body: string,
        done: (err: Error | null, result: object) => void,
      ) => {
        try {
          const json = JSON.parse(body)
          done(null, json)
        } catch (err) {
          done(err as Error, undefined)
        }
      },
    )
  }

  /**
   * Sets up error handling for the Fastify server.
   *
   * @private
   */
  private setupErrorHandling(): void {
    this.server.setErrorHandler(
      (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
        this.server.log.error(error)
        reply.status(500).send({
          error: 'Internal Server Error',
          message:
            process.env.NODE_ENV === 'production' ? undefined : error.message,
        })
      },
    )
  }

  /**
   * Starts the HTTP server on the specified port.
   *
   * @param {number} port - The port number to listen on
   * @public
   */
  public start(port: number): void {
    this.server.listen({ port }, (err: Error | null) => {
      if (err) {
        this.server.log.error(err)
        process.exit(1)
      }

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
      .sort((a, b) => a.localeCompare(b))
      .forEach((domain) => {
        console.log(`\n🔹 Domain: ${domain}`)

        // Sort routes by path for easier reading
        ;[...routesByDomain[domain]]
          .sort((a, b) => a.path.localeCompare(b.path))
          .forEach(({ method, path }) => {
            console.log(`  ${method.padEnd(6)} ${path}`)
          })
      })

    console.log('\n✅ Server ready to handle requests!')
  }

  /**
   * Registers all routes with the Fastify server.
   * Maps each route's handler to the corresponding HTTP method and path.
   *
   * @param {IHttpRoute[]} routes - Array of routes to register
   * @private
   */
  private setupRoutes(routes: IHttpRoute[]): void {
    routes.forEach((route) => {
      this.server.route({
        method: route.method.toUpperCase() as HTTPMethods,
        url: route.getPath(),
        handler: this.adaptRoute(route.handler),
      })
    })
  }

  /**
   * Adapts a route handler function to a Fastify handler.
   * Transforms Fastify request/reply objects to application-specific interfaces.
   *
   * @param {Function} handler - The route handler function that accepts HttpRequest and returns HttpResponse
   * @returns {Function} Fastify handler function
   * @private
   */
  private adaptRoute(
    handler: (httpRequest: HttpRequest) => HttpResponse | Promise<HttpResponse>,
  ) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const httpRequest: HttpRequest = {
        body: request.body || {},
        params: request.params as Record<string, string>,
        query: request.query as Record<string, string | string[]>,
        headers: request.headers as Record<string, string>,
      }

      try {
        const httpResponse = await handler(httpRequest)
        reply.status(httpResponse.status).send(httpResponse.body)
      } catch (error) {
        this.server.log.error(error)
        reply.status(500).send({
          error: 'Internal Server Error',
          message:
            process.env.NODE_ENV === 'production'
              ? undefined
              : (error as Error).message,
        })
      }
    }
  }
}
