import { HttpMethods } from 'infra/http/enums/http-methods.enum'
import { HttpRoute } from '../http-route'
import { HttpResponse } from 'infra/http/interfaces/http-response.interface'
import { HttpStatus } from 'infra/http/enums/http-status.enum'
import { HttpRequest } from 'infra/http/interfaces/http-request.interface'

function handler(_request: HttpRequest): HttpResponse {
  return {
    status: HttpStatus.OK,
    body: [],
  }
}

export const ListExamplesRoute = new HttpRoute(
  1,
  'examples',
  HttpMethods.GET,
  '/',
  handler,
)
