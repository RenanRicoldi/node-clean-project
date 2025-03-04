import { HttpMethods } from '../enums/http-methods.enum'
import { HttpRequest } from '../interfaces/http-request.interface'
import { HttpResponse } from '../interfaces/http-response.interface'
import { IHttpRoute } from '../interfaces/http-route.interface'

export class HttpRoute implements IHttpRoute {
  readonly version: number
  readonly domain: string
  readonly method: HttpMethods
  readonly handler: (
    request: HttpRequest,
  ) => HttpResponse | Promise<HttpResponse>
  private readonly path: string

  constructor(
    version: number,
    domain: string,
    method: HttpMethods,
    path: string,
    handler: (request: HttpRequest) => HttpResponse | Promise<HttpResponse>,
  ) {
    this.version = version
    this.domain = domain
    this.method = method
    this.path = path
    this.handler = handler
  }

  /**
   * Retorna o caminho completo da rota
   * @returns Caminho formatado como /v{version}/{domain}/{path}
   */
  getPath(): string {
    // Remove barras duplicadas e garante formato correto
    const formattedPath = this.path.startsWith('/')
      ? this.path
      : `/${this.path}`
    return `/v${this.version}/${this.domain}${formattedPath}`
  }
}
