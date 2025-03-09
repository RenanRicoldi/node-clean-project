# HTTP

## Visão Geral

A pasta `http` contém toda a implementação relacionada ao protocolo HTTP no projeto. Esta camada foi projetada seguindo os princípios SOLID e Clean Architecture para garantir:

- **Independência de frameworks**: A lógica de negócios não depende de frameworks HTTP específicos
- **Testabilidade**: Componentes podem ser testados isoladamente
- **Extensibilidade**: Novos frameworks podem ser adicionados facilmente

## Estrutura da Pasta

```
http/
├── enums/           # Enumerações relacionadas a HTTP (métodos, status codes)
├── express/         # Implementação específica do framework Express
├── fastify/         # Implementação específica do framework Fastify
├── interfaces/      # Interfaces que definem contratos para implementações HTTP
└── routes/          # Definições de rotas e manipuladores de requisições
```

## Interfaces Principais

As interfaces principais que definem os contratos para implementações HTTP são:

- `IHttpApi`: Interface para implementações de servidores HTTP
- `IHttpRoute`: Interface para definição de rotas
- `HttpRequest`: Interface para representação de requisições HTTP
- `HttpResponse`: Interface para representação de respostas HTTP

## Frameworks Suportados

Atualmente, o projeto suporta os seguintes frameworks HTTP:

1. **Express**: Implementação padrão, escolhida por sua simplicidade e ampla adoção
2. **Fastify**: Alternativa de alto desempenho com validação integrada

Para alternar entre os frameworks, modifique o arquivo `src/config/dependency-injection.config.ts`.

## Como Criar uma Nova Rota

Para criar uma nova rota, siga os passos abaixo:

1. Crie um novo arquivo na pasta `routes` com o sufixo `.route.ts` (ex: `user-create.route.ts`)
2. Implemente a classe de rota estendendo `HttpRoute`:

```typescript
import { HttpRoute } from '../http-route'
import { HttpMethods } from '../../enums/http-methods.enum'
import { HttpStatus } from '../../enums/http-status.enum'
import { HttpRequest } from '../../interfaces/http-request.interface'
import { HttpResponse } from '../../interfaces/http-response.interface'

export class CreateUserRoute extends HttpRoute {
  constructor() {
    super(
      1, // versão da API
      'users', // domínio
      HttpMethods.POST, // método HTTP
      '/', // caminho (será combinado como /v1/users/)
      async (request: HttpRequest): Promise<HttpResponse> => {
        // Implementação do handler
        return {
          status: HttpStatus.CREATED,
          body: { message: 'User created successfully' }
        }
      }
    )
  }
}

// Exportar uma instância da rota para carregamento automático
export const createUserRoute = new CreateUserRoute()
```

3. A rota será carregada automaticamente pelo sistema de carregamento dinâmico em `routes/index.ts`

## Como Adicionar um Novo Framework

Para adicionar suporte a um novo framework HTTP (além do Express):

1. Crie uma nova pasta com o nome do framework em `http/` (ex: `http/fastify/`)
2. Implemente a interface `IHttpApi` para o novo framework:

```typescript
import { injectable, inject } from 'tsyringe'
import { IHttpApi } from '../interfaces/http-api.interface'
import { IHttpRoute } from '../interfaces/http-route.interface'

@injectable()
export class ApiFastify implements IHttpApi {
  constructor(@inject('Routes') private routes: IHttpRoute[]) {
    // Inicialização do framework
  }

  public start(port: number): void {
    // Implementação para iniciar o servidor
  }

  public listRoutes(): void {
    // Implementação para listar rotas
  }

  // Métodos privados específicos do framework
}
```

3. Atualize o arquivo de configuração de injeção de dependência em `src/config/dependency-injection.config.ts` para usar o novo framework:

```typescript
container.register<IHttpApi>('HttpApi', {
  useClass: ApiFastify, // Altere para usar o novo framework
})
```

## Carregamento Automático de Rotas

O sistema de carregamento automático de rotas (`routes/index.ts`) escaneia recursivamente a pasta `routes` em busca de arquivos com o sufixo `.route.ts` e carrega todas as instâncias de `HttpRoute` exportadas.

Para mais detalhes sobre implementações específicas de frameworks, consulte os READMEs dentro de cada pasta de framework. 