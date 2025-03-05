import { ApiExpress } from '../infra/http/express/http-api.express'
import { IHttpApi } from '../infra/http/interfaces/http-api.interface'
import routes from '../infra/http/routes'
import 'reflect-metadata'
import { container } from 'tsyringe'

export function setupDependencyInjection(): void {
  // Registra as rotas
  container.register('Routes', {
    useValue: routes,
  })

  // Registra a implementação da API HTTP
  container.register<IHttpApi>('HttpApi', {
    useClass: ApiExpress,
  })
}
