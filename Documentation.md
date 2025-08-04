https://app.rocketseat.com.br/classroom/nest-js/group/desacoplando-camadas-no-nest-js/lesson/rotas-privadas-por-padrao

![alt text](image.png)
Appontamentos
[] - criação
[] - edicao ( reagendar )
[] - listagem ( searchQuery )
[] - confirmar agendamento
[] - cancelar agendamento
# Casos de Uso - Appointment

## 1. Criar agendamento
- Duração deve ser múltiplo de 30 minutos.
- Data não pode estar no passado.
- Status inicial: `PENDING`.

## 2. Confirmar agendamento
- Só permitido se o status atual for `PENDING`.
- Registrar `updatedBy` e `updatedAt`.

## 3. Cancelar agendamento
- Não cancelar se já estiver `CANCELED`.
- Registrar `updatedBy` e `updatedAt`.

## 4. Reagendar
- Não permitido se status for `CANCELED`.
- Nova data não pode estar no passado.
- Atualizar `updatedBy` e `updatedAt`.

## 5. Listar agendamentos por usuário
- Filtrar por `userId`.
- Possível opção para ocultar agendamentos com status `CANCELED`.

## 6. Validar conflitos de horário
- Impedir agendamentos sobrepostos para o mesmo usuário.
- Apenas `PENDING` pode coexistir até confirmação.

## 7. Atualizar descrição ou detalhes
- Permitido apenas para status `PENDING` ou `CONFIRMED`.
- Registrar `updatedBy`.

## 8. Auditar histórico de atualizações *(opcional, mas recomendado)*
- Log de mudanças de status.
- Registro de quem fez cada alteração.















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