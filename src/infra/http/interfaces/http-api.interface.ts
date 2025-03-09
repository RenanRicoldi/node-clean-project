/**
 * Interface for HTTP API implementations.
 * Defines the contract that any HTTP server implementation must follow.
 */
export interface IHttpApi {
  /**
   * Starts the HTTP server on the specified port.
   *
   * @param {number} port - The port number to listen on
   */
  start(port: number): void

  /**
   * Lists all available routes in the application.
   * Used for debugging and documentation purposes.
   */
  listRoutes(): void
}
