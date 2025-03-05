import { ApiExpress } from '../infra/http/express/http-api.express'
import { IHttpApi } from '../infra/http/interfaces/http-api.interface'
import routes from '../infra/http/routes'
import 'reflect-metadata'
import { container } from 'tsyringe'

/**
 * Configures the dependency injection container for the application.
 * Registers the routes and HTTP API implementation.
 */
export function setupDependencyInjection(): void {
  // Register the routes
  container.register('Routes', {
    useValue: routes,
  })

  // Register the HTTP API implementation
  container.register<IHttpApi>('HttpApi', {
    useClass: ApiExpress,
  })
}
