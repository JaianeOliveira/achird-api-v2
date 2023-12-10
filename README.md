# Achird API

![GitHub License](https://img.shields.io/github/license/jaianeoliveira/achird-api)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/jaianeoliveira/achird-api/develop)

![banner](https://github.com/JaianeOliveira/achird-api/assets/82323559/e627e2f4-c30f-4852-baac-d432e342dd67)
![preview](https://github.com/JaianeOliveira/achird-api/assets/82323559/ba88f97e-ea77-475d-86da-e9e4f9a3863e)

## Documentação da API

#### Documentação completa com SwaggerUI

```
GET /v1/api-docs
```

#### Ping

```
GET /v1/ping
```

## Rodando Localmente

> A versão do node utilizada é a `v20.5.1`

### 1. Clone do repositório e instalação das dependências

Clone o repositório na sua máquina

```bash
git clone https://github.com/JaianeOliveira/achird-api.git
```

Dentro da pasta do projeto, instale as dependências

```bash
npm install
```

Renomeie o arquivo `.env.example` para `.env` e preencha os dados que faltam.

### 2. Banco de dados

A partir de agora é necessário escolher qual banco de dados você quer usar localmente:

- SQL: SQLITE
- NoSQL: MongoDB
- Local: Array na memória

De acordo com o que você preferir, no arquivo `.env`, altere a variável `CURRENT_DATABASE` para `test`, `sql`ou `nosql`.

#### SQL (SQLITE)

Rode o comando para criar o banco de dados a partir do schema do prisma

```bash
npm run db:create
```

Se quiser visualizar o banco de dados em forma de tabela, rode:

```bash
   npm run db:view
```

e acesse `http://localhost:5555`.

#### NoSQL (MongoDB)

Rode o container do docker através do comando:

```bash
   sudo docker-compose up -d
```

#### Local (Array na memória)

Não é necessária nenhuma configuração.

### 3. Rodando o servidor em modo desenvolvimento

Inicialize a API em modo de desenvolvimento com o comando:

```bash
npm run dev
```

Acesse o endereço exibido no console no navegador para ver se está funcionando corretamente ou acesse a rota `/v1/api-docs` para visualizar a documentação da API.

## variáveis ambiente

- `DATABASE_SQL_URL` Link para o banco de dados SQL
- `CLIENT_ID` Client ID do aplicativo do Github
- `CLIENT_SECRET` Client Secret do aplicativo do github
- `REDIRECT_URI` Geralmente o link da página do front-end
- `APP_NAME` Nome da aplicação.
  - Default: `Achird API`
- `PORT` Porta para rodar o servidor.
  - Default: `3333`
- `IP` IP para rodar o servidor.
  - Default: `localhost`
- `DATABASE_URL` Link para o bando de dados NoSQL
- `DATABASE_USERNAME` Usuário do banco de dados NoSQL
- `DATAPASE_PASSWORD` Senha do usuário do banco de dados NoSQL
- `CURRENT_DATABASE` Database que está sendo atualmente utilizado na aplicação.
  - Possiveis valores: `test`, `sql`, `nosql`
  - Default: `test`

## Stack utilizada

NodeJS, Express, Typescript, MongoDB, Prisma, axios

## Autores

- [@jaianeoliveira](https://www.github.com/jaianeoliveira)
- [@alexsandro49](https://www.github.com/alexsandro49)

## Feedbacks e bugs

Se você tiver algum feedback,tiver alguma dúvida ou quiser relatar algum bug, por favor nos deixe saber por meio do email [jaianeoliveira.dev@gmail.com](mailto:jaianeoliveira.dev@gmail.com).

## Licença

[GNU General Public License v3.0](LICENSE)
