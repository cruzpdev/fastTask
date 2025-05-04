# FAST TASK - Aplicação de Gerenciamento de Tarefas

FAST TASK é uma aplicação completa de gerenciamento de tarefas desenvolvida com React no frontend e Express.js com MySQL no backend. A aplicação permite aos usuários criar contas, gerenciar listas de tarefas e organizar suas atividades diárias de forma eficiente.

## Funcionalidades

- Autenticação completa (login, cadastro, recuperação de senha)
- Gerenciamento de listas de tarefas
- Criação, edição e exclusão de tarefas
- Dashboard com visão geral das tarefas
- Interface responsiva e amigável

## Pré-requisitos

Para executar a aplicação, você precisará ter instalado:

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)
- MySQL (versão 5.7 ou superior)

## Configuração do Backend

1. Navegue até a pasta do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo .env com suas informações de banco de dados (um arquivo .env.example está disponível como referência):

```
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=fast_task_user
DB_PASSWORD=password
DB_NAME=fast_task_db

# Configurações JWT
JWT_SECRET=fast_task_secret_key_2025
JWT_EXPIRES_IN=1h

# Configurações do Servidor
PORT=3001
NODE_ENV=development
```

4. Inicie o servidor backend:

```bash
npm start
```

O servidor backend estará rodando em http://localhost:3001.

## Configuração do Frontend

1. Navegue até a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Para produção, você pode construir o frontend:

```bash
npm run build
```

E então servir os arquivos estáticos gerados na pasta `dist` usando um servidor web como Nginx ou Apache.

## Uso da Aplicação

1. Acesse a aplicação pelo navegador no endereço indicado pelo frontend
2. Crie uma nova conta na página de cadastro ou faça login se já tiver uma conta
3. Na dashboard, você pode criar novas listas de tarefas
4. Dentro de cada lista, você pode adicionar, editar e excluir tarefas
5. Marque tarefas como concluídas quando finalizá-las

## Recuperação de Senha

1. Na tela de login, clique em "Esqueceu sua senha?"
2. Informe o e-mail cadastrado
3. Siga as instruções enviadas para seu e-mail para redefinir sua senha

## Estrutura do Projeto

### Backend

- `/src/config` - Configurações da aplicação e banco de dados
- `/src/controllers` - Controladores para manipulação das requisições
- `/src/middlewares` - Middlewares para autenticação e validação
- `/src/models` - Modelos de dados
- `/src/repositories` - Camada de acesso ao banco de dados
- `/src/routes` - Definição das rotas da API
- `/src/services` - Lógica de negócio
- `/src/tests` - Testes automatizados

### Frontend

- `/src/components` - Componentes reutilizáveis
- `/src/contexts` - Contextos React (incluindo autenticação)
- `/src/pages` - Páginas da aplicação
- `/src/services` - Serviços para comunicação com a API
- `/src/utils` - Funções utilitárias

## Executando em Ambiente de Produção

Para executar a aplicação em um ambiente de produção:

1. Configure o arquivo .env do backend com as configurações apropriadas para produção
2. Construa o frontend com `npm run build`
3. Configure um servidor web (como Nginx ou Apache) para servir os arquivos estáticos do frontend
4. Configure um proxy reverso para direcionar as requisições da API para o backend
5. Considere usar um gerenciador de processos como PM2 para manter o backend em execução
