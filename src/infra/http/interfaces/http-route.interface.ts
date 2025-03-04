import { HttpMethods } from '../enums/http-methods.enum'
import { HttpRequest } from './http-request.interface'
import { HttpResponse } from './http-response.interface'
export interface IHttpRoute {
  path: string
  method: HttpMethods
  handler: (request: HttpRequest) => HttpResponse | Promise<HttpResponse>
}
