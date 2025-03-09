import { HttpMethods } from '../enums/http-methods.enum'
import { HttpRequest } from './http-request.interface'
import { HttpResponse } from './http-response.interface'

/**
 * Interface for HTTP routes.
 * Defines the contract that all route implementations must follow.
 */
export interface IHttpRoute {
  /**
   * HTTP method for the route (get, post, put, delete, etc.).
   */
  readonly method: HttpMethods

  /**
   * Domain or resource name for the route.
   * Used for grouping related routes.
   */
  readonly domain: string

  /**
   * API version number.
   * Used for versioning the API endpoints.
   */
  readonly version: number

  /**
   * Handler function that processes the HTTP request.
   * Takes an HttpRequest object and returns an HttpResponse.
   */
  readonly handler: (
    request: HttpRequest,
  ) => HttpResponse | Promise<HttpResponse>

  /**
   * Gets the complete path for the route.
   * Combines version, domain, and path into a formatted URL.
   *
   * @returns {string} Complete route path
   */
  getPath(): string
}
