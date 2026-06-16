# Deployment (free tier)

Architecture: **Vercel** (React frontend) → **Render** (NestJS API) → **Aiven** (MySQL).

Deploy in this order — each step produces a URL the next one needs.

## 1. Database — Aiven (free MySQL)

1. Sign up at https://aiven.io → create a **MySQL** service on the **free plan**.
2. Once it's running, open the service and copy the connection details:
   host, port, user, password, database name.
3. Aiven requires TLS, so the backend must run with `DB_SSL=true`.

## 2. Backend — Render

1. Sign up at https://render.com → **New → Web Service** → connect the
   `url-shortener` GitHub repo.
2. Settings:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm run start:prod`
3. Add environment variables:

   | Key | Value |
   |-----|-------|
   | `DB_HOST` | (Aiven host) |
   | `DB_PORT` | (Aiven port) |
   | `DB_USERNAME` | (Aiven user) |
   | `DB_PASSWORD` | (Aiven password) |
   | `DB_NAME` | (Aiven database) |
   | `DB_SYNCHRONIZE` | `true` |
   | `DB_SSL` | `true` |
   | `JWT_SECRET` | a long random string |
   | `JWT_EXPIRES_IN` | `1d` |
   | `BASE_URL` | your Render URL, e.g. `https://url-shortener-api.onrender.com` |
   | `CORS_ORIGIN` | (set after step 3 — the Vercel URL) |

4. Deploy. Note the service URL.

## 3. Frontend — Vercel

1. Sign up at https://vercel.com → **Add New → Project** → import the
   `url-shortener-web` repo. Vercel auto-detects Vite.
2. Add an environment variable:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://<your-render-url>/graphql` |

3. Deploy. Note the Vercel URL.

## 4. Close the loop

Back on Render, set `CORS_ORIGIN` to your Vercel URL (e.g.
`https://url-shortener-web.vercel.app`) and redeploy the backend.

Open the Vercel URL — register, shorten a link, done.

## Notes

- Render's free web service **sleeps after ~15 min idle**; the first request
  after that takes ~30–50s to wake. Fine for a demo.
- `DB_SYNCHRONIZE=true` auto-creates tables on first boot. Switch to TypeORM
  migrations before treating this as production.
