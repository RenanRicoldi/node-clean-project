import { ApiExpress } from '../infra/http/express/http-api.express'
// Importação da implementação do Fastify (commented by default)
// import { ApiFastify } from '../infra/http/fastify/http-api.fastify'
import { IHttpApi } from '../infra/http/interfaces/http-api.interface'
import routes from '../infra/http/routes'
import 'reflect-metadata'
import { container } from 'tsyringe'

/**
 * Configures the dependency injection container.
 * Registers all dependencies needed for the application.
 */
export function setupDependencyInjection(): void {
  // Register routes
  container.register('Routes', {
    useValue: routes,
  })

  // Register HTTP API implementation
  // You can choose which implementation to use: Express (default) or Fastify
  container.register<IHttpApi>('HttpApi', {
    useClass: ApiExpress, // To use Fastify, replace with: ApiFastify
  })

  // Register other application dependencies here
}
