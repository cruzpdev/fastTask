# Use Debian slim (compatível com o bcryptjs pré-compilado)
FROM node:18-bullseye-slim

# Diretório de trabalho
WORKDIR /app

# Copia e instala dependências
COPY package*.json ./
RUN npm ci

# Copia o restante do código
COPY . .

# Exponha a porta que o app usa
EXPOSE 3001

# Comando de inicialização
CMD ["npm", "start"]
