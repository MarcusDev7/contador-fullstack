# Cash Register Fullstack Simulator

Projeto fullstack desenvolvido com o objetivo de praticar a construção de aplicações completas, integrando **backend em Java com Spring Boot**, **persistência em PostgreSQL** e **front-end em React consumindo API REST em tempo real**.

## Tecnologias utilizadas

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- PostgreSQL
- Swagger OpenAPI
- DTO Pattern
- Global Exception Handler

### Frontend
- React
- Vite
- Fetch API
- CSS moderno responsivo

---

## Arquitetura aplicada

A aplicação segue o padrão de arquitetura em camadas:

- **Controller** → responsável por expor endpoints HTTP REST  
- **Service** → aplicação das regras de negócio  
- **Repository** → comunicação com banco de dados  
- **Entity** → modelagem da tabela persistida  
- **DTO** → controle de dados expostos para o cliente  

Fluxo da aplicação:

Frontend → Requisição HTTP → Controller → Service → Repository → Banco de Dados → Response JSON → Frontend

---

## Funcionalidades

- Registrar entrada de valor no caixa
- Registrar saída de valor no caixa
- Resetar valor total
- Persistência em banco de dados
- Feedback visual e sonoro na interface
- Tratamento global de erros
- Documentação de endpoints via Swagger

---

## Interface

O front-end simula um **painel de caixa registradora**, exibindo o saldo em tempo real e consumindo a API backend.

---

## Objetivo do projeto

Este projeto foi desenvolvido com foco em:

- Evolução prática como desenvolvedor backend
- Integração real entre front e backend
- Entendimento do ciclo completo de uma aplicação web
- Construção de portfólio profissional

---

## Como executar o projeto

### Backend

```bash
cd contador-api
mvn spring-boot:run
