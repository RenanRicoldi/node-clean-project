import 'reflect-metadata'
import { container } from 'tsyringe'
import { setupDependencyInjection } from './config/dependency-injection.config'
import { IHttpApi } from './infra/http/interfaces/http-api.interface'

// Configure the dependency injection container
setupDependencyInjection()

/**
 * Setup function to start the application.
 * Initializes all necessary components and starts the HTTP server.
 *
 * @returns {Promise<void>}
 */
async function setup(): Promise<void> {
  try {
    // Resolve the HTTP API from the container
    const httpApi = container.resolve<IHttpApi>('HttpApi')

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

    // Start the server
    httpApi.start(port)
  } catch (error) {
    console.error('Error starting application:', error)
    process.exit(1)
  }
}

// Execute the setup function
setup().catch(console.error)
