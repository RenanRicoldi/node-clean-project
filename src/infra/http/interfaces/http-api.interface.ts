export interface IHttpApi {
  start(port: number): void
  listRoutes(): void
}
