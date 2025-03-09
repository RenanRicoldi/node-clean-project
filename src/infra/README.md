# Infraestrutura (Infra)

## Visão Geral

A pasta `infra` contém toda a infraestrutura técnica do projeto, seguindo os princípios da Clean Architecture. Esta camada é responsável por implementar as interfaces definidas nas camadas internas e fornecer adaptadores para recursos externos como frameworks, bancos de dados, serviços web e outras ferramentas.

## Princípios da Clean Architecture

Na Clean Architecture, a camada de infraestrutura é a mais externa e tem as seguintes características:

- **Dependências direcionadas para dentro**: A infraestrutura depende das camadas internas, nunca o contrário
- **Adaptadores e implementações concretas**: Contém implementações concretas das interfaces definidas nas camadas internas
- **Detalhes técnicos**: Lida com frameworks, bibliotecas e ferramentas específicas

## Estrutura da Pasta

A pasta `infra` está organizada da seguinte forma:

- `http/`: Implementações relacionadas a HTTP, incluindo rotas, controladores e frameworks web
- Outras pastas podem incluir:
  - `database/`: Implementações de persistência de dados
  - `external/`: Integrações com serviços externos
  - `messaging/`: Implementações de mensageria
  - `storage/`: Implementações de armazenamento

## Como Contribuir

Ao adicionar novas implementações na camada de infraestrutura:

1. Verifique se existe uma interface correspondente nas camadas internas
2. Implemente a interface seguindo os princípios SOLID
3. Mantenha o código específico de frameworks isolado nesta camada
4. Documente adequadamente usando TSDoc
5. Crie testes para suas implementações

## Relacionamento com Outras Camadas

```
┌─────────────────┐
│    Entidades    │ ◄─┐
└────────┬────────┘   │
         │            │
         ▼            │
┌─────────────────┐   │
│  Casos de Uso   │ ◄─┤
└────────┬────────┘   │
         │            │
         ▼            │
┌─────────────────┐   │
│  Adaptadores    │ ◄─┤
└────────┬────────┘   │
         │            │
         ▼            │
┌─────────────────┐   │
│ Infraestrutura  │───┘
└─────────────────┘
```

A camada de infraestrutura implementa as interfaces definidas nas camadas internas, permitindo que o núcleo da aplicação permaneça independente de detalhes técnicos específicos.

Para mais detalhes sobre implementações específicas, consulte os READMEs dentro de cada subpasta. 