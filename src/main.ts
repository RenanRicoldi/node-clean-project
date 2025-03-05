import 'reflect-metadata'
import { container } from 'tsyringe'
import { setupDependencyInjection } from './config/dependency-injection.config'
import { IHttpApi } from './infra/http/interfaces/http-api.interface'

// Configura o container de injeção de dependências
setupDependencyInjection()

// Inicia a aplicação
async function bootstrap(): Promise<void> {
  try {
    // Resolve a API HTTP do container
    const httpApi = container.resolve<IHttpApi>('HttpApi')

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

    // Inicia o servidor
    httpApi.start(port)
  } catch (error) {
    console.error('Erro ao iniciar aplicação:', error)
    process.exit(1)
  }
}

// Executa a função de bootstrap
bootstrap().catch(console.error)
