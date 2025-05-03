# Imagem oficial do Node.js
FROM node:18

# Diretório de trabalho no container
WORKDIR /app

# Copiar apenas os arquivos de dependências para cache
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta que o Express utiliza
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "src/index.js"]
