# URL Shortener + Analytics API

A **GraphQL API** built with **NestJS** + **TypeORM** + **MySQL** that shortens long
URLs and tracks click analytics (count, IP, user-agent, referer, timestamps).
JWT authentication; short URLs are owned by the user who created them.

## Tech stack

- **NestJS** (TypeScript) — modular architecture
- **GraphQL** (code-first) with **Apollo Server**
- **TypeORM** + **MySQL** (`mysql2` driver)
- **JWT auth** (`@nestjs/jwt` + Passport) with bcrypt-hashed passwords
- **class-validator** — input validation on GraphQL inputs

> The only REST endpoints are the public redirect (`GET /:slug`) and a health
> check (`GET /health`) — a browser hitting a short link needs an HTTP 302, which
> isn't something GraphQL handles. Everything else is GraphQL.

## Getting started

### 1. Prerequisites
- Node.js 20+
- A running MySQL instance

### 2. Create the database
```sql
CREATE DATABASE url_shortener;
```

### 3. Configure environment
Copy `.env.example` to `.env` and set your MySQL credentials (`DB_PASSWORD`, etc.).

### 4. Install & run
```bash
npm install
npm run start:dev
```
GraphQL Playground: http://localhost:3000/graphql

## GraphQL operations

| Operation | Type | Auth | Description |
|-----------|------|------|-------------|
| `register(input)` | mutation | – | Create an account, returns `{ accessToken }` |
| `login(input)`    | mutation | – | Log in, returns `{ accessToken }` |
| `createUrl(input)` | mutation | ✅ | Create a short URL (optional `customSlug`) |
| `myUrls`           | query    | ✅ | List your short URLs |
| `urlStats(slug)`   | query    | ✅ | Click analytics for one of your slugs |
| `GET /:slug`       | REST     | –  | Redirect to the original URL (records a click) |

Authenticated operations require an `Authorization: Bearer <accessToken>` header.

### Example
```graphql
# 1. register (returns accessToken)
mutation { register(input: { email: "you@example.com", password: "secret123" }) { accessToken } }

# 2. createUrl — set HTTP header: Authorization: Bearer <accessToken>
mutation { createUrl(input: { originalUrl: "https://nestjs.com" }) { slug originalUrl } }

# 3. analytics
query { urlStats(slug: "abc1234") { totalClicks recentClicks { ipAddress clickedAt } } }
```

## Roadmap (planned enhancements)
- [ ] Redis caching for hot redirects
- [ ] Rate limiting (`@nestjs/throttler`)
- [x] Auth (JWT) so users own their links
- [ ] Unit + e2e test coverage
- [ ] Dockerfile + docker-compose
- [ ] GitHub Actions CI
- [ ] Database migrations (instead of `synchronize`)
