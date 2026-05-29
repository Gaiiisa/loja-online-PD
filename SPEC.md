# SPEC — ZeroGrau Professional E-Commerce Platform (SDD)

Projeto baseado no site atual hospedado em https://artvieirasantana.github.io/ZeroGrau/, evoluindo para uma arquitetura profissional escalável com frontend Angular, backend Java Spring Boot, API REST segura, banco de dados relacional e infraestrutura enterprise.

---

# 1. Visão Geral do Produto

## Nome do Projeto
**ZeroGrau Commerce Platform**

## Objetivo
Transformar o site atual em uma plataforma de e-commerce profissional, segura, escalável e preparada para produção real, incluindo:

- Catálogo de produtos
- Carrinho
- Checkout
- Autenticação
- Painel administrativo
- API REST
- Integração com pagamentos
- Gestão de estoque
- Segurança avançada
- Observabilidade
- Deploy automatizado
- Arquitetura cloud-ready

---

# 2. Arquitetura Geral

## Stack Principal

| Camada | Tecnologia |
|---|---|
| Frontend | Angular 20+ |
| Backend | Java 21 + Spring Boot 3 |
| Banco de Dados | PostgreSQL |
| ORM | Spring Data JPA + Hibernate |
| Segurança | Spring Security + JWT |
| Cache | Redis |
| Gateway/API | Spring Cloud Gateway |
| Upload de Imagens | AWS S3 / Cloudinary |
| Mensageria | RabbitMQ |
| Containerização | Docker |
| Orquestração | Kubernetes |
| CI/CD | GitHub Actions |
| Monitoramento | Prometheus + Grafana |
| Logs | ELK Stack |
| CDN | Cloudflare |
| Hospedagem | AWS / Azure |

---

# 3. Arquitetura do Sistema

## Arquitetura Macro

```text
[ Angular Frontend ]
        |
        v
[ API Gateway ]
        |
 ------------------------------------------------
 |               |              |               |
 v               v              v               v
Auth API     Product API    Order API     Payment API
        |
        v
[ PostgreSQL ]
        |
        v
[ Redis Cache ]
```

---

# 4. Módulos do Sistema

## 4.1 Frontend Angular

### Responsabilidades
- Interface do usuário
- Consumo da API REST
- Gerenciamento de sessão
- Carrinho local
- Renderização SSR opcional
- Responsividade
- SEO

### Estrutura

```text
src/
 ├── core/
 ├── shared/
 ├── features/
 │    ├── auth/
 │    ├── cart/
 │    ├── checkout/
 │    ├── products/
 │    ├── admin/
 │    └── orders/
 ├── layouts/
 └── environments/
```

---

## 4.2 Backend Spring Boot

### Módulos

| Módulo | Função |
|---|---|
| Auth Service | Login e autenticação |
| Product Service | Produtos |
| Order Service | Pedidos |
| Payment Service | Pagamentos |
| Notification Service | Emails |
| Admin Service | Painel administrativo |

---

# 5. Funcionalidades

## Cliente

### Catálogo
- Busca
- Filtros
- Ordenação
- Categorias
- Avaliações

### Conta
- Cadastro
- Login
- Recuperação de senha
- Endereço
- Histórico de pedidos

### Carrinho
- Adicionar/remover produtos
- Cupom
- Frete
- Persistência

### Checkout
- PIX
- Cartão
- Boleto
- Integração Mercado Pago / Stripe

### Pedidos
- Rastreamento
- Status
- Cancelamento

---

## Administrativo

### Produtos
- CRUD completo
- Controle de estoque
- Upload de imagens
- SKU
- Promoções

### Usuários
- Controle de acesso
- Bloqueio
- Auditoria

### Pedidos
- Aprovação
- Expedição
- Status logístico

### Dashboard
- KPIs
- Vendas
- Conversão
- Produtos mais vendidos

---

# 6. Requisitos Funcionais

| ID | Requisito |
|---|---|
| RF-01 | Usuário deve criar conta |
| RF-02 | Usuário deve autenticar |
| RF-03 | Usuário deve recuperar senha |
| RF-04 | Sistema deve listar produtos |
| RF-05 | Sistema deve permitir filtros |
| RF-06 | Sistema deve processar pagamentos |
| RF-07 | Admin deve cadastrar produtos |
| RF-08 | Sistema deve controlar estoque |
| RF-09 | Sistema deve registrar pedidos |
| RF-10 | Sistema deve gerar logs |

---

# 7. Requisitos Não Funcionais

| ID | Requisito |
|---|---|
| RNF-01 | API RESTful |
| RNF-02 | Tempo médio < 300ms |
| RNF-03 | Sistema responsivo |
| RNF-04 | Escalabilidade horizontal |
| RNF-05 | Segurança OWASP |
| RNF-06 | 99.9% uptime |
| RNF-07 | Criptografia TLS 1.3 |
| RNF-08 | JWT expiração automática |
| RNF-09 | Rate limiting |
| RNF-10 | Logs centralizados |

---

# 8. Segurança do E-Commerce

## Autenticação

- JWT Access Token
- Refresh Token
- OAuth2 opcional
- MFA opcional

---

## Proteções

### Backend
- CSRF Protection
- CORS Controlado
- Rate Limiting
- SQL Injection Protection
- XSS Protection
- CSP Headers
- Helmet Security
- Validação server-side

### Infraestrutura
- WAF
- CDN
- Anti-DDoS
- Secrets Manager
- IAM Roles

### Banco
- Senhas com BCrypt
- Dados criptografados
- Backup automatizado

---

## Compliance

- LGPD
- PCI DSS
- OWASP Top 10

---

# 9. Modelagem de Banco

## Principais Entidades

### User

```text
id
name
email
password
role
created_at
```

### Product

```text
id
name
description
price
stock
category_id
image_url
```

### Order

```text
id
user_id
status
total
created_at
```

### Order Item

```text
id
order_id
product_id
quantity
price
```

---

# 10. API REST

## Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
```

---

## Produtos

```http
GET /api/products
GET /api/products/{id}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
```

---

## Pedidos

```http
POST /api/orders
GET /api/orders/{id}
```

---

# 11. Fluxo de Checkout

```text
Usuário
  ↓
Carrinho
  ↓
Checkout
  ↓
Gateway de Pagamento
  ↓
Confirmação
  ↓
Pedido Criado
  ↓
Email enviado
```

---

# 12. Design System

## Stack
- HTML5 + CSS3 + JavaScript (Angular-style SPA)
- Design System: Bebas Neue + Space Mono + DM Sans
- Paleta: #111111 · #00BFFF · #FF4D4F · #52C41A

## Páginas / Módulos
- `/` — Home com Hero, vitrine e destaques
- `#catalog` — Catálogo com filtros e sidebar
- `#cart` — Carrinho com cupom e resumo
- `#checkout` — Checkout com PIX, Cartão, Boleto
- `#auth` — Login / OAuth2
- `#admin` — Painel Admin: Dashboard, Produtos, Pedidos, Usuários
---

## Tipografia

| Tipo | Fonte |
|---|---|
| Headings | Poppins |
| Texto | Inter |

---

## Componentes

- Navbar
- Product Card
- Cart Drawer
- Checkout Form
- Admin Tables
- Dashboard Widgets

---

# 13. Estrutura de Deploy

## Ambientes

| Ambiente | Objetivo |
|---|---|
| Local | Desenvolvimento |
| Dev | Integração |
| Staging | Homologação |
| Production | Produção |

---

## Docker

### Frontend

```dockerfile
FROM node:22
```

### Backend

```dockerfile
FROM eclipse-temurin:21
```

---

# 14. CI/CD

## Pipeline GitHub Actions

### Backend
- Build Maven
- Testes
- SonarQube
- Docker Build
- Deploy Kubernetes

### Frontend
- Build Angular
- ESLint
- Testes
- Deploy CDN

---

# 15. Observabilidade

## Logs
- ELK Stack

## Métricas
- Prometheus

## Dashboards
- Grafana

## Tracing
- OpenTelemetry

---

# 16. Estratégia de Escalabilidade

## Horizontal Scaling
- Pods Kubernetes
- Load Balancer

## Cache
- Redis

## CDN
- Cloudflare

## Banco
- Read Replicas

---

# 17. Estratégia DevOps

## GitFlow

```text
main
develop
feature/*
hotfix/*
release/*
```

---

## Scrum

### Sprints
- 2 semanas

### Cerimônias
- Daily
- Planning
- Review
- Retrospective

---

# 18. Roadmap

## MVP
- Catálogo
- Carrinho
- Login
- Checkout

## V2
- Painel Admin
- Dashboard
- Cupons

## V3
- IA para recomendação
- Marketplace
- App Mobile

---

# 19. Estrutura de Pastas

## Backend

```text
src/main/java/com/zerograu
 ├── config
 ├── controller
 ├── service
 ├── repository
 ├── security
 ├── dto
 ├── entity
 └── exception
```

---

## Frontend

```text
src/app
 ├── core
 ├── shared
 ├── features
 ├── layouts
 └── services
```

---

# 20. Tecnologias Futuras

- Elasticsearch
- Microservices
- Kafka
- Recomendação IA
- Mobile App Flutter

---

# 21. Riscos Técnicos

| Risco | Mitigação |
|---|---|
| Ataques DDoS | Cloudflare |
| Vazamento de dados | Criptografia |
| Escalabilidade | Kubernetes |
| Fraudes | Gateway antifraude |

---

# 22. Conclusão

A evolução do ZeroGrau transformará um frontend estático hospedado em GitHub Pages em uma plataforma enterprise moderna, segura e escalável, utilizando Angular + Spring Boot, arquitetura API-first, segurança baseada em OWASP, observabilidade completa e infraestrutura cloud-native preparada para crescimento real de e-commerce.