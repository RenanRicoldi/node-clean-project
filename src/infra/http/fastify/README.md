# Fastify

## Visão Geral

Esta pasta contém a implementação do framework Fastify como adaptador HTTP para a aplicação. O Fastify foi escolhido como uma alternativa ao Express por seu alto desempenho, baixo overhead e suporte nativo a TypeScript.

## Implementação

A implementação do Fastify segue o padrão Adapter, onde a classe `ApiFastify` implementa a interface `IHttpApi` definida na camada de interfaces. Isso permite que a aplicação utilize o Fastify sem criar dependências diretas com o framework.

### Classe Principal: ApiFastify

A classe `ApiFastify` (`http-api.fastify.ts`) é o componente central que:

- Inicializa o servidor Fastify
- Configura parsers de conteúdo e middlewares
- Registra rotas dinamicamente
- Implementa tratamento de erros
- Inicia o servidor HTTP
- Adapta o formato de requisições/respostas entre Fastify e as interfaces da aplicação

## Injeção de Dependência

A classe `ApiFastify` utiliza injeção de dependência via TSyringe:

```typescript
@injectable()
export class ApiFastify implements IHttpApi {
  constructor(@inject('Routes') private routes: IHttpRoute[]) {
    // ...
  }
}
```

Isso permite que as rotas sejam injetadas automaticamente pelo container de DI.

## Adaptação de Requisições e Respostas

Um aspecto importante da implementação é a adaptação entre os objetos de requisição/resposta do Fastify e as interfaces da aplicação:

```typescript
private adaptRoute(handler) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Converte Request do Fastify para HttpRequest da aplicação
    const httpRequest: HttpRequest = {
      body: request.body || {},
      params: request.params as Record<string, string>,
      query: request.query as Record<string, string | string[]>,
      headers: request.headers as Record<string, string>,
    }

    // Processa a requisição usando o handler da rota
    const httpResponse = await handler(httpRequest)

    // Converte HttpResponse da aplicação para Reply do Fastify
    reply.status(httpResponse.status).send(httpResponse.body)
  }
}
```

## Configuração e Middlewares

A implementação atual configura:

- Logger integrado do Fastify
- Parser de conteúdo JSON personalizado
- Validação e coerção de tipos via Ajv (integrado ao Fastify)
- Tratamento de erros centralizado

## Diferenças em Relação ao Express

Algumas diferenças notáveis em relação à implementação do Express:

1. **Desempenho**: O Fastify é otimizado para alta performance
2. **Validação integrada**: Usa Ajv para validação de esquemas
3. **Sistema de plugins**: Arquitetura baseada em plugins em vez de middlewares
4. **Logging nativo**: Sistema de logging integrado
5. **Tratamento de erros**: Mecanismo centralizado via `setErrorHandler`

## Como Usar

Para utilizar o Fastify em vez do Express, atualize o arquivo de configuração de injeção de dependência em `src/config/dependency-injection.config.ts`:

```typescript
import { ApiFastify } from '../infra/http/fastify/http-api.fastify'

// ...

container.register<IHttpApi>('HttpApi', {
  useClass: ApiFastify, // Altere para usar Fastify
})
```

## Extensão

Para estender a implementação do Fastify:

1. **Adicionar plugins**: Use `server.register()` no método `setupMiddlewares()`
2. **Configurar CORS**: Adicione o plugin `@fastify/cors`
3. **Adicionar compressão**: Utilize o plugin `@fastify/compress`
4. **Servir arquivos estáticos**: Adicione o plugin `@fastify/static`

Exemplo de adição de plugin CORS:

```typescript
import cors from '@fastify/cors'

private setupMiddlewares(): void {
  this.server.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  })
}
```

## Considerações de Segurança

Ao estender esta implementação, considere adicionar:

- `@fastify/helmet` para cabeçalhos de segurança
- `@fastify/rate-limit` para prevenir ataques de força bruta
- Validação de esquemas para prevenir injeções
- Sanitização de saída para prevenir XSS 