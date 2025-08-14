## AINDA EM DESENVOLVIMENTO ##

## 🧾 IT Management API (Clinic API)

API para gestão de usuários, agendamentos e procedimentos, com autenticação JWT (RS256), arquitetura limpa e testes automatizados. Projetada para ser clara, escalável e fácil de manter.

---

## 🧠 Sumário

- **Contexto**: visão geral do problema e objetivo
- **Destaques técnicos**: pontos fortes do projeto
- **Features**
- **Stack**
- **Arquitetura**: camadas e fluxo
- **Estrutura de pastas**
- **Domínio e Casos de Uso**
- **Endpoints principais**
- **Ambiente e Execução**
- **Autenticação**
- **Testes**
- **Roadmap** e **Decisões técnicas**
- **Licença**

---

## 🎯 Contexto

Este projeto implementa um backend de gestão (procedimentos e agendamentos) típico de clínicas, com autenticação segura, regras de negócio explícitas e camadas bem separadas (DDD + Clean Architecture). O foco é qualidade de código, testabilidade e observabilidade do fluxo.

---

## 💡 Destaques técnicos

- **Clean Architecture + DDD**: domínio isolado, casos de uso puros, infraestrutura plugável
- **JWT RS256** com chaves pública/privada carregadas via `EnvService`
- **Prisma ORM** em PostgreSQL, mapeadores explícitos (Domain <-> Prisma)
- **Swagger** em `/docs` com suporte a Bearer token
- **Validação declarativa** com `ZodValidationPipe`
- **Either** funcional para erros e sucesso previsíveis
- **Testes** unitários e E2E com `vitest` e `supertest`

---

## ✅ Features

- Cadastro e autenticação de usuários
- Agendamentos: criar, listar, listar por usuário, confirmar, cancelar
- Procedimentos: registrar, listar, listar por usuário
- Autorização via JWT (rotas públicas anotadas com `@Public()`)
- Documentação automática com Swagger

---

## 🚀 Stack

- Node.js, TypeScript, NestJS
- Prisma ORM, PostgreSQL, Docker
- Zod, Swagger, Passport-JWT
- Vitest, Supertest

---

## 🏗 Arquitetura

Fluxo geral do backend:

```mermaid
graph TD
  A["Client (HTTP)"] --> B["NestJS Controller (/appointments, /procedures, /users, /session)"]
  B --> C["Use Case (Application Layer)"]
  C --> D["Repositories (Interfaces)"]
  D --> E["Prisma Repositories (Infra)"]
  E --> F["PrismaService"]
  F --> G["PostgreSQL"]

  subgraph "Auth"
    H["JwtAuthGuard (global)"] -.-> B
    I["JwtStrategy RS256"] --> H
    J["EnvService PUBLIC_KEY/PRIVATE_KEY"] --> I
  end

  subgraph "Validation"
    K["ZodValidationPipe"] -.-> B
  end
```

Princípios:

- **Controllers finos**: apenas orquestram a entrada/saída HTTP e chamam casos de uso
- **Use Cases**: encapsulam regras de negócio e dependem de interfaces de repositório
- **Infra**: implementa repositórios com Prisma e serviços (JWT, Bcrypt, Env)

---

## 🗂 Estrutura de pastas (principal)

O código está em `it-management/`:

- `src/domain/management/enterprise/entities`: entidades de domínio (`User`, `Appointment`, `Procedure`)
- `src/domain/management/application`: casos de uso, repositórios (interfaces) e contratos de criptografia
- `src/infra`: camadas externas (HTTP, Auth, Cryptography, Database, Env)
  - `infra/http/controllers`: endpoints REST separados por contexto
  - `infra/database/prisma`: mapeadores e repositórios Prisma
  - `infra/auth`: guardas, estratégia JWT e decorator `@Public`
  - `infra/cryptography`: `JwtEncrypter`, `BcryptHasher`
  - `infra/env`: `EnvService` e schema `zod`
- `prisma/schema.prisma`: modelos `User`, `Appointment`, `Procedure` e enum `ProcedureName`
- `test` e `src/**/__unit__`/`__e2e__`: testes unitários e E2E

---

## 🧩 Domínio e Casos de Uso

Entidades:

- `User { name, email, sector, password, createdAt, updatedAt }`
- `Appointment { userId, name, description?, duration, status, dateHour, updatedBy?, ... }`
- `Procedure { appointmentId, userId, name, value, product?, region, updatedBy?, ... }`

Casos de uso (Application):

- `users`
  - `register-user`: registra usuário (valida e-mail único, hash de senha)
  - `authenticate-user`: autentica e emite JWT (`sub = user.id`)
- `appointments`
  - `create-appointment`: valida usuário, intervalo de horário e cria agendamento
  - `confirm-appointment`: valida agendamento e usuário que confirma, atualiza status
  - `cancel-appointment`: valida agendamento e usuário que cancela, atualiza status
  - `get-appointments-by-user-id`: valida usuário, lista agendamentos por usuário
  - `fetch-appointments`: busca paginada com filtro textual
  - `reschedule-appointment`: regras implementadas (pendente controller HTTP)
- `procedures`
  - `register-procedure`: valida usuário/agendamento e registra procedimento
  - `get-procedures-by-user-id`: lista procedimentos por usuário
  - `fetch-procedures`: busca paginada com filtro textual e por enum `name`
  - `edit-procedure`: regras implementadas (pendente controller HTTP)

Erros de domínio são modelados com `Either` e erros específicos (`UserNotFoundError`, `InvalidIntervalError`, etc.).

---

## 🌐 Endpoints principais

Base URL: `http://localhost:3333`

Autenticação: Bearer Token (exceto rotas anotadas com `@Public()`).

| Método | Caminho                 | Auth    | Descrição                          |
| ------ | ----------------------- | ------- | ---------------------------------- |
| POST   | `/users`                | Público | Registra usuário                   |
| POST   | `/session`              | Público | Autentica e retorna `access_token` |
| POST   | `/appointments`         | JWT     | Cria agendamento                   |
| GET    | `/appointments`         | JWT     | Lista agendamentos (query/page)    |
| GET    | `/appointments/:userId` | JWT     | Lista agendamentos por usuário     |
| PATCH  | `/appointments/confirm` | JWT     | Confirma agendamento               |
| PATCH  | `/appointments/cancel`  | JWT     | Cancela agendamento                |
| POST   | `/procedures`           | JWT     | Cria procedimento                  |
| GET    | `/procedures`           | JWT     | Lista procedimentos (query/page)   |
| GET    | `/procedures/:userId`   | JWT     | Lista procedimentos por usuário    |

Documentação Swagger: `GET /docs`

Exemplos de uso estão em `it-management/client.http`.

---

## ⚙️ Ambiente e Execução

Pré-requisitos:

- Node.js 18+ e pnpm
- Docker (para PostgreSQL)

### 1) Variáveis de ambiente

Crie `it-management/.env`:

```
PORT=3333
DATABASE_URL="postgresql://postgres:docker@localhost:5432/clinicdb?schema=public"
PRIVATE_KEY="<BASE64_DA_PRIVATE_PEM>"
PUBLIC_KEY="<BASE64_DA_PUBLIC_PEM>"
```

Gerando chaves RSA (RS256):

- Com OpenSSL (Git Bash/WSL/Linux/macOS):

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
# Base64 (Linux/macOS):
base64 -w 0 private.pem > private.b64 && base64 -w 0 public.pem > public.b64
```

- Base64 no Windows PowerShell:

```
[Convert]::ToBase64String([IO.File]::ReadAllBytes("private.pem"))
[Convert]::ToBase64String([IO.File]::ReadAllBytes("public.pem"))
```

Cole os valores resultantes nas variáveis `PRIVATE_KEY` e `PUBLIC_KEY`.

### 2) Subir o banco com Docker

Na pasta `it-management/`:

```
docker-compose up -d
```

### 3) Instalar dependências e preparar Prisma

Na pasta `it-management/`:

```
pnpm install
pnpm prisma migrate dev
pnpm prisma generate
```

Para ambientes sem migrações interativas (CI/prod):

```
pnpm prisma migrate deploy
```

### 4) Rodar a API

```
pnpm start:dev
# Abra: http://localhost:3333/docs
```

---

## 🔐 Autenticação

- Estratégia JWT RS256 com chaves base64 em `EnvService`
- Guard global `JwtAuthGuard`; rotas públicas usam `@Public()`
- Payload mínimo: `{ sub: user.id }`

Enviar header:

```
Authorization: Bearer <access_token>
```

---

## 🧪 Testes

- Unitários e de casos de uso: `pnpm test`
- E2E: `pnpm test:e2e` (usa `test/setup-e2e.ts` para criar schema isolado e `pnpm prisma db push`)

Cobertura: `pnpm test:cov`

Certifique-se que o PostgreSQL está rodando e `DATABASE_URL` está definido.

---

## 📄 Principais scripts (package.json)

- `start:dev`: desenvolvimento com watch
- `test`, `test:watch`, `test:e2e`, `test:cov`
- `build` e `start:prod`

---

## 🧱 Decisões técnicas e Notas

- Camadas explícitas e baixo acoplamento para facilitar testes e evolução
- Mapeadores Prisma dedicados garantem isolamento do domínio
- `ZodValidationPipe` padroniza erros 400 e mensagens de validação
- Swagger documenta payloads e respostas com exemplos
- Próximos passos importantes listados no roadmap

---

## 🗺 Roadmap

- Expor controller HTTP para `reschedule-appointment`
- Expor controller HTTP para `edit-procedure`
- Regras de autorização por perfil (`Role` enum) nas rotas sensíveis
- Auditoria e trilhas de alterações (usar `updatedBy` de forma consistente)
- Melhorias de observabilidade (logs estruturados e métricas)

---

## 📜 Licença

UNLICENSED (consulte `it-management/package.json`).
