<h1 align="center">🔗 url-shortener</h1>

<p align="center">A small URL shortener with click tracking — GraphQL API, built with NestJS.</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white" alt="GraphQL">
  <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

You register, create short links, and the API tracks each click (count, IP,
user agent, referrer). Links are tied to the user who made them.

```
register → get token → createUrl → /r/abc123 → 302 redirect (+ logged click) → urlStats
```

## Features

- shorten URLs with a random slug or your own custom one
- redirect endpoint that records every click
- per-link analytics: total clicks + IP, user agent, referrer, time
- JWT auth, bcrypt-hashed passwords
- links are scoped to their owner (you only see/manage your own)
- rate limiting (60 req/min per IP)
- input validation on everything (email, url, slug rules)
- unit tests with Jest

## Stack

- NestJS + TypeScript
- GraphQL (Apollo, code-first)
- TypeORM + MySQL
- JWT auth (Passport, bcrypt)

The redirect (`/r/:slug`) and `/health` are plain REST since a short link has to
return an HTTP redirect. Everything else goes through GraphQL.

## Running it

You'll need Node 20+ and MySQL.

```bash
# create the db
mysql -u root -p -e "CREATE DATABASE url_shortener;"

cp .env.example .env   # then fill in your DB password + a JWT_SECRET

npm install
npm run start:dev
```

GraphQL endpoint / playground: http://localhost:3000/graphql

## API

| Operation | Auth | What it does |
|-----------|------|--------------|
| `register` / `login` mutations | no | returns an access token |
| `createUrl` mutation | yes | makes a short link (optional custom slug) |
| `myUrls` query | yes | your links |
| `urlStats(slug)` query | yes | click stats for one of your links |
| `GET /r/:slug` | no | redirects, records the click |

Authenticated calls need an `Authorization: Bearer <token>` header.

Quick example:

```graphql
mutation { register(input: { email: "me@test.com", password: "secret123" }) { accessToken } }

# set the Authorization header, then:
mutation { createUrl(input: { originalUrl: "https://nestjs.com" }) { slug } }

query { urlStats(slug: "abc1234") { totalClicks recentClicks { ipAddress clickedAt } } }
```

