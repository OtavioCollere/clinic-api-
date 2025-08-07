# 🧾 it-management-api

Uma API robusta e escalável para gerenciamento de procedimentos e agendamentos, com autenticação baseada em JWT, arquitetura desacoplada e foco em qualidade de código, testabilidade e manutenção.

---

## 🧠 Sumário

- [Contexto](#contexto)
- [Destaques técnicos](#destaques-técnicos)
- [Demonstração](#demonstração)
- [Features](#features)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Scripts disponíveis](#scripts-disponíveis)
- [Como rodar os testes](#como-rodar-os-testes)
- [Documentação da API](#documentação-da-api)
- [Casos de uso principais](#casos-de-uso-principais)
- [Autenticação](#autenticação)
- [Design de Domínio](#design-de-domínio)
- [Tratamento de erros](#tratamento-de-erros)
- [Cobertura de testes](#cobertura-de-testes)
- [Decisões técnicas](#decisões-técnicas)
- [Roadmap](#roadmap)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 🎯 Contexto

Essa API foi desenvolvida com o objetivo de simular um sistema real de gestão de agendamentos e procedimentos com autenticação segura, seguindo padrões profissionais como Clean Architecture, Domain-Driven Design e testes automatizados.

O projeto representa um cenário comum de sistemas empresariais com múltiplos contextos de negócio, regras específicas e foco em qualidade de software.

---

## 💡 Destaques técnicos

- Estrutura baseada em **Clean Architecture**
- **Domain-Driven Design** com separação por módulos de contexto
- **Autenticação JWT** com chave pública e privada
- **Testes automatizados** unitários e E2E
- **Tratamento de erros funcional** com Either
- Integração com **Prisma** e banco relacional
- Documentação automática com **Swagger**
- Ambiente completo via **Docker Compose**

---

## 📽️ Demonstração

> Em breve: vídeo de demonstração com uso real da API via Swagger e Postman.

![Swagger Screenshot](./docs/swagger.png)

---

## ✅ Features

- Cadastro e login com JWT seguro
- CRUD de procedimentos
- Agendamento de procedimentos com regras de disponibilidade
- Proteção de rotas por autenticação
- Swagger com autenticação integrada
- Testes unitários e end-to-end com alta cobertura
- Deploy pronto com Docker

---

## 🚀 Stack

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Vitest](https://vitest.dev/) + [Supertest](https://github.com/visionmedia/supertest)
- [Swagger](https://swagger.io/)
- [Docker](https://www.docker.com/)
- JWT com chaves pública/privada

---

## 🏗 Arquitetura

- **Camadas isoladas**: domain, application, infrastructure, presentation
- **DDD**: Cada módulo possui suas entidades, casos de uso e repositórios
- **Inversão de dependência** entre aplicação e infraestrutura
- **Controllers finos**: orquestram casos de uso
- **Validação explícita** com tratamento funcional de erros

---

## 🛠 Instalação

```bash
git clone https://github.com/seu-usuario/it-management-api.git
cd it-management-api
cp .env.example .env
docker-compose up --build

sem docker
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm start:dev

SCRIPTS DISPONIVEIS
pnpm dev          # Inicia em modo desenvolvimento
pnpm build        # Compila o projeto
pnpm start        # Inicia em produção
pnpm test         # Roda testes unitários
pnpm test:e2e     # Roda testes E2E
pnpm lint         # Verifica padrões de código
