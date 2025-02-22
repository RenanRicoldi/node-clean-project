# Usa a imagem oficial do Node.js com a versão 22.14.0 e Alpine (mais leve)
FROM node:22.14.0-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Copia os arquivos de gerenciamento de pacotes
COPY package.json pnpm-lock.yaml ./

# Usa o pnpm para instalação
RUN pnpm install --frozen-lockfile --prod

# Copia o restante dos arquivos da aplicação
COPY . .

# Porta que a aplicação vai usar (ajuste conforme necessário)
EXPOSE 3000

# Comando para iniciar a aplicação (ajuste conforme seu package.json)
CMD ["pnpm", "start"] 