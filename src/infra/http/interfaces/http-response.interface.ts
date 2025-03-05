import { HttpStatus } from '../enums/http-status.enum'

/**
 * Interface representing an HTTP response.
 * Framework-agnostic representation of HTTP response data.
 */
export interface HttpResponse<BodyType = unknown> {
  /**
   * HTTP status code.
   * Indicates the result of the HTTP request.
   */
  status: HttpStatus
  /**
   * Response body.
   * Data to be sent back to the client.
   */
  body?: BodyType
  headers?: Record<string, string>
}
