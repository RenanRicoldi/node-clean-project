import { HttpMethods } from '../enums/http-methods.enum'
import { HttpRequest } from '../interfaces/http-request.interface'
import { HttpResponse } from '../interfaces/http-response.interface'
import { IHttpRoute } from '../interfaces/http-route.interface'

/**
 * Base implementation of the HTTP route interface.
 * Provides common functionality for all routes in the application.
 *
 * @implements {IHttpRoute}
 */
export class HttpRoute implements IHttpRoute {
  /**
   * Creates an instance of HttpRoute.
   *
   * @param {number} version - API version number
   * @param {string} domain - Domain/resource name for the route
   * @param {HttpMethods} method - HTTP method (get, post, put, delete, etc.)
   * @param {string} path - Route path (without version and domain)
   * @param {Function} handler - Function that handles the HTTP request
   */
  constructor(
    public readonly version: number,
    public readonly domain: string,
    public readonly method: HttpMethods,
    private readonly path: string,
    public readonly handler: (
      request: HttpRequest,
    ) => HttpResponse | Promise<HttpResponse>,
  ) {}

  /**
   * Gets the complete path for the route.
   * Combines version, domain, and path into a formatted URL.
   *
   * @returns {string} Complete route path in format /v{version}/{domain}/{path}
   */
  getPath(): string {
    const pathWithoutLeadingSlash = this.path.startsWith('/')
      ? this.path.substring(1)
      : this.path

    return `/v${this.version}/${this.domain}/${pathWithoutLeadingSlash}`
      .replace(/\/+/g, '/')
      .replace(/\/$/, '')
  }
}
