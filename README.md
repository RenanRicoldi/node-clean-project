# 🚀 Projeto Node.js com Docker

[![Node.js 22.14](https://img.shields.io/badge/Node.js-22.14-brightgreen)](https://nodejs.org/)
[![Docker 20.10.8+](https://img.shields.io/badge/Docker-20.10.8%2B-blue)](https://www.docker.com/)

Guia de execução para desenvolvimento e produção

## 📥 Clonar o Projeto
```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

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