# URL Shortener + Analytics API

A REST API built with **NestJS** + **TypeORM** + **MySQL** that shortens long URLs
and tracks click analytics (count, IP, user-agent, referer, timestamps).

## Tech stack

- **NestJS** (TypeScript) — modular architecture
- **TypeORM** + **MySQL** (`mysql2` driver)
- **class-validator** / **class-transformer** — DTO validation
- **Swagger** — auto-generated API docs at `/docs`

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
App runs on http://localhost:3000 — Swagger docs at http://localhost:3000/docs

## API

| Method | Route               | Description                                    |
|--------|---------------------|------------------------------------------------|
| POST   | `/urls`             | Create a short URL (optional `customSlug`)     |
| GET    | `/urls`             | List all short URLs                            |
| GET    | `/urls/:slug/stats` | Click analytics for a slug                     |
| GET    | `/:slug`            | Redirect to the original URL (records a click) |

### Example
```bash
curl -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://nestjs.com/some/long/path"}'
```

## Roadmap (planned enhancements)
- [ ] Redis caching for hot redirects
- [ ] Rate limiting (`@nestjs/throttler`)
- [ ] Auth (JWT) so users own their links
- [ ] Unit + e2e test coverage
- [ ] Dockerfile + docker-compose
- [ ] GitHub Actions CI
- [ ] Database migrations (instead of `synchronize`)
