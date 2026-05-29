# ZeroGrau Platform — E-commerce Profissional

Plataforma de e-commerce robusta e segura, desenvolvida com as melhores práticas de mercado.

## 🚀 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Angular 20 · Standalone · Signals · JWT Interceptor |
| **Backend** | Spring Boot 3.3 · Java 21 · Spring Security 6 |
| **Banco** | H2 Database (Memória/Dev) · Suporte a PostgreSQL |
| **Segurança** | JWT (jjwt 0.12.5) · BCrypt · Validação de Input (Bean Validation) |

## 🛠️ Configuração e Execução (VS Code)

### Pré-requisitos
- **Java 21** instalado.
- **Node.js 20+** instalado.
- **VS Code** com extensões:
  - *Extension Pack for Java*
  - *Spring Boot Extension Pack*
  - *Angular Language Service*

### Passo 1: Backend (Spring Boot)
1. Abra a pasta `backend` no VS Code.
2. Aguarde o Maven importar as dependências.
3. Certifique-se de que o Java 21 está selecionado como JDK do projeto.
4. Execute a classe `ZeroGrauApplication.java` ou use o terminal:
   ```bash
   mvn spring-boot:run
   ```
   *O backend rodará em `http://localhost:8080`.*

### Passo 2: Frontend (Angular)
1. Abra a pasta `frontend` no VS Code.
2. No terminal, execute a instalação ignorando conflitos de dependências de peer (comum em versões recentes do Angular):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   *O frontend rodará em `http://localhost:4200`.*

---

## 🔒 Segurança e Boas Práticas Implementadas

- **Autenticação JWT:** Implementada com tokens de acesso e refresh tokens. O segredo é configurável via variável de ambiente `JWT_SECRET`.
- **BCrypt:** Senhas de usuários são criptografadas antes de serem salvas no banco de dados.
- **Validação no Backend:** Todos os inputs são validados no servidor usando `jakarta.validation` (Bean Validation). Preços, quantidades e tamanhos de campos são rigorosamente verificados.
- **Segurança no Frontend:** Nenhuma informação sensível (como chaves de API ou segredos) está hardcoded no código cliente.
- **CORS:** Configurado para permitir apenas origens autorizadas.
- **H2 Console:** Disponível em `/h2-console` para inspeção de dados em tempo de desenvolvimento.

## 👤 Credenciais de Teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| **Admin** | `admin@zerograu.com` | `admin123` |
| **Cliente** | `ana@zerograu.com` | `cliente123` |

## 📂 Estrutura do Projeto

```
zerograu-platform/
├── backend/                # Spring Boot 3 + Java 21
│   ├── src/main/java/...   # Código fonte organizado por camadas
│   └── pom.xml             # Dependências Maven
└── frontend/               # Angular 20
    ├── src/app/            # Componentes, Serviços e Signals
    └── package.json        # Scripts e dependências npm
```

---
*Desenvolvido para ser uma base sólida e profissional para e-commerce.*
# loja-online-PD
