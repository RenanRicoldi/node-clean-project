import { HttpMethods } from '../enums/http-methods.enum'
import { HttpRequest } from '../interfaces/http-request.interface'
import { HttpResponse } from '../interfaces/http-response.interface'
import { IHttpRoute } from '../interfaces/http-route.interface'

export class HttpRoute implements IHttpRoute {
  constructor(
    readonly method: HttpMethods,
    readonly path: string,
    readonly handler: (
      request: HttpRequest,
    ) => HttpResponse | Promise<HttpResponse>,
  ) {}
}
