import { HttpMethods } from '../enums/http-methods.enum'
import { HttpRequest } from './http-request.interface'
import { HttpResponse } from './http-response.interface'

export interface IHttpRoute {
  readonly version: number
  readonly domain: string
  readonly method: HttpMethods
  readonly handler: (
    request: HttpRequest,
  ) => HttpResponse | Promise<HttpResponse>
  getPath(): string
}
