# 🚀 Projeto Node.js com Docker

[![Node.js 22.14](https://img.shields.io/badge/Node.js-22.14-brightgreen)](https://nodejs.org/)
[![Docker 20.10.8+](https://img.shields.io/badge/Docker-20.10.8%2B-blue)](https://www.docker.com/)

Guia de execução para desenvolvimento e produção

## 📥 Clonar o Projeto
```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

## 🔧 Fluxo de Desenvolvimento

### Padrão de Commits
**Siga o [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification)**:
```
tipo(escopo?): descrição breve

Corpo detalhado (opcional)

BREAKING CHANGE: mudanças radicais (opcional)
```

**Tipos válidos**:
| Tipo       | Descrição                                  |
|------------|-------------------------------------------|
| `feat`     | Nova funcionalidade                      |
| `fix`      | Correção de bug                          |
| `docs`     | Alterações na documentação              |
| `style`    | Formatação de código (espaços, vírgulas)|
| `refactor`| Refatoração sem mudança de comportamento|
| `chore`    | Tarefas de manutenção                   |
| `test`     | Adição/ajuste de testes                |

**Exemplos**:
```bash
git commit -m "feat(api): add user authentication endpoint"
git commit -m "fix: correct login validation error"
```

### Git Hooks Automatizados
**1. Pré-commit**:
- Executa ESLint e Prettier nos arquivos modificados
- Formata automaticamente o código
- Bloqueia commit com erros de lint

**2. Verificação de Mensagem**:
- Valida o formato da mensagem de commit
- Rejeita mensagens fora do padrão Conventional Commits

**Benefícios**:
- Histórico de commits organizado e semântico
- Código padronizado entre colaboradores
- Detecção precoce de erros de formatação
- Compatível com geração automática de CHANGELOG

## ▶️ Executar com Docker
```bash
# Modo produção (build otimizado)
docker-compose up --build

# Modo desenvolvimento (atualizações automáticas)
docker-compose -f docker-compose.development.yml up
```

## 💻 Executar Localmente
**Pré-requisitos**:
- Node.js 22.14+
- PNPM 8.x+

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev

# Build e execução em produção
pnpm run build && pnpm start
```

## 🔍 Testar a Aplicação
Acesse no navegador:  
http://localhost:3000

## 📂 Estrutura do projeto
```
./
├── src/          # Código fonte
├── docker/       # Configurações Docker
├── .env          # Variáveis de ambiente
└── package.json  # Configurações do projeto
```