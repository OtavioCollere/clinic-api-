# ✅ Checklist de Setup NestJS com DDD + Prisma + JWT

- [ ] Iniciar projeto Nest (`nest new`)
- [ ] Criar ConfigModule (acesso a variáveis de ambiente)

## 🧠 Camada de Domínio

- [ ] Criar entidades (`domain/enterprise`)
- [ ] Criar tipos utilitários:
  - [ ] `Either` (resultado funcional: right / left)
  - [ ] `Optional<T, K>` (tornar campos opcionais por tipo)
- [ ] Criar interfaces de repositórios (`domain/application/repositories`)
- [ ] Criar casos de uso (`domain/application/use-cases`)
- [ ] Criar repositórios em memória (fakes para testes unitários)


## 🛠 Infraestrutura e Banco

- [ ] Configurar Prisma (`schema.prisma`, gerar client)
- [ ] Criar `DatabaseModule` com `PrismaService`
- [ ] Implementar repositórios concretos com Prisma

## ⚙️ Utilitários

- [ ] Criar `ZodValidationPipe`
- [ ] Configurar banco de testes isolado (`.env.test`, reset DB)
- [ ] Criar stubs de criptografia (`FakeHasher`, `FakeEncrypter`)

## 🔐 Autenticação

- [ ] Criar caso de uso de autenticação com JWT
- [ ] Criar caso de uso de refresh token

## 🌐 Camada HTTP

- [ ] Criar `HttpModule`
- [ ] Criar controllers (rotas de autenticação etc.)
- [ ] Importar `DatabaseModule` no `HttpModule`
- [ ] Apontar repositórios concretos com `provide: ... useClass: ...`


// fazer aplicação funcionar no endpoint de users e tokens

// configurar banco de testes isolados

// Criar controller e testes e2e de tokens

// documentar

[] - testes unitarios products

[] - controllers products

[] - controllers users

[] - banco isolado

[] - testes e2e

[] - documentacoes