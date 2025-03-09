/**
 * Interface representing an HTTP request.
 * Framework-agnostic representation of HTTP request data.
 */
export interface HttpRequest<BodyType = unknown> {
  /**
   * Request body data.
   * Contains the payload sent with the request.
   */
  body: BodyType

  /**
   * URL parameters.
   * Parameters extracted from the route path.
   */
  params: Record<string, string>

  /**
   * Query string parameters.
   * Parameters extracted from the URL query string.
   */
  query: Record<string, string | string[]>

  /**
   * HTTP headers.
   * Key-value pairs of header names and values.
   */
  headers: Record<string, string>
}
