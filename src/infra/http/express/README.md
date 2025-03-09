# Express

## Visão Geral

Esta pasta contém a implementação do framework Express como adaptador HTTP para a aplicação. O Express foi escolhido por sua simplicidade, flexibilidade e ampla adoção na comunidade Node.js.

## Implementação

A implementação do Express segue o padrão Adapter, onde a classe `ApiExpress` implementa a interface `IHttpApi` definida na camada de interfaces. Isso permite que a aplicação utilize o Express sem criar dependências diretas com o framework.

### Classe Principal: ApiExpress

A classe `ApiExpress` (`http-api.express.ts`) é o componente central que:

- Inicializa a aplicação Express
- Configura middlewares padrão
- Registra rotas dinamicamente
- Inicia o servidor HTTP
- Adapta o formato de requisições/respostas entre Express e as interfaces da aplicação

## Injeção de Dependência

A classe `ApiExpress` utiliza injeção de dependência via TSyringe:

```typescript
@injectable()
export class ApiExpress implements IHttpApi {
  constructor(@inject('Routes') private routes: IHttpRoute[]) {
    // ...
  }
}
```

Isso permite que as rotas sejam injetadas automaticamente pelo container de DI.

## Adaptação de Requisições e Respostas

Um aspecto importante da implementação é a adaptação entre os objetos de requisição/resposta do Express e as interfaces da aplicação:

```typescript
private adaptRoute(handler) {
  return async (req: Request, res: Response) => {
    // Converte Request do Express para HttpRequest da aplicação
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query as Record<string, string | string[]>,
      headers: req.headers as Record<string, string>,
    }

    // Processa a requisição usando o handler da rota
    const httpResponse = await handler(httpRequest)

    // Converte HttpResponse da aplicação para Response do Express
    res.status(httpResponse.status).json(httpResponse.body)
  }
}
```

## Middlewares

A implementação atual configura os seguintes middlewares padrão:

- `express.json()`: Para parsing de corpos de requisição JSON
- `express.urlencoded()`: Para parsing de dados de formulário

Para adicionar novos middlewares, modifique o método `setupMiddlewares()`.

## Extensão

Para estender a implementação do Express:

1. **Adicionar middlewares globais**: Modifique o método `setupMiddlewares()`
2. **Configurar CORS**: Adicione o middleware cors no método `setupMiddlewares()`
3. **Adicionar logging**: Implemente um middleware de logging
4. **Tratamento de erros**: Estenda o adaptador de rota para incluir tratamento de exceções

Exemplo de adição de middleware de tratamento de erros:

```typescript
private setupErrorHandling(): void {
  this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? undefined : err.message
    })
  })
}
```

## Considerações de Segurança

Ao estender esta implementação, considere adicionar:

- Helmet para cabeçalhos de segurança
- Rate limiting para prevenir ataques de força bruta
- Validação de entrada para prevenir injeções
- Sanitização de saída para prevenir XSS

## Relacionamento com a Camada HTTP

Esta implementação é apenas um adaptador para o framework Express. A lógica de negócios e a definição de rotas estão em camadas separadas, permitindo que o Express seja substituído por outro framework sem afetar o restante da aplicação. 