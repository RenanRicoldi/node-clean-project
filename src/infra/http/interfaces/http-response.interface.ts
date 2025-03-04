import { HttpStatus } from '../enums/http-status.enum'

export interface HttpResponse<BodyType = unknown> {
  status: HttpStatus
  body?: BodyType
  headers?: Record<string, string>
}
