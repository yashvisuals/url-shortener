<h1 align="center">🔗 url-shortener</h1>

<p align="center">A small URL shortener with click tracking — GraphQL API, built with NestJS.</p>

<p align="center">
  <strong>Live demo:</strong>
  <a href="https://url-shortener-web-eight.vercel.app">url-shortener-web-eight.vercel.app</a>
  <br />
  <sub>free tier — the first request may take ~30s while the API wakes up</sub>
</p>

<p align="center">
  <img src="https://github.com/yashvisuals/url-shortener/actions/workflows/ci.yml/badge.svg" alt="CI">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white" alt="GraphQL">
  <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

You register, create short links, and the API tracks each click (count, IP,
user agent, referrer). Links are tied to the user who made them.

> This is the backend. The React frontend lives in
> [url-shortener-web](https://github.com/yashvisuals/url-shortener-web).

```
register → get token → createUrl → /r/abc123 → 302 redirect (+ logged click) → urlStats
```

## Features

- **Shortening** — turn any long URL into a 7-character slug, or pass your own
  custom slug. Custom slugs are checked for uniqueness; random ones retry on the
  rare collision.
- **Redirects with tracking** — `GET /r/:slug` issues a 302 to the original URL
  and logs the visit (IP, user agent, referrer, timestamp) in the same request.
- **Per-link analytics** — total click count plus the most recent clicks, served
  through the `urlStats` query.
- **Authentication** — register / log in to get a JWT; passwords are hashed with
  bcrypt and never stored or returned in plaintext.
- **Ownership** — every short URL belongs to the user who created it. You can
  only list and view stats for your own links; asking about someone else's
  returns a 403.
- **Rate limiting** — 60 requests/minute per IP across both GraphQL and the
  redirect route, to curb abuse.
- **Validation** — all inputs are validated (valid email, password length,
  proper URL with protocol, slug character/length rules) before they hit the DB.
- **Self-documenting API** — every GraphQL type, field and operation has a
  description, visible in Apollo Sandbox and the committed schema.
- **Tested** — unit tests for the services and an end-to-end test covering the
  full register → create → redirect → stats flow, run on CI.

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
| `me` query | yes | the current user |
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

