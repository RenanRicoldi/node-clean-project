import { HttpMethods } from '../../enums/http-methods.enum'
import { HttpRoute } from '../http-route'
import { HttpResponse } from '../../interfaces/http-response.interface'
import { HttpStatus } from '../../enums/http-status.enum'
import { HttpRequest } from '../../interfaces/http-request.interface'

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
