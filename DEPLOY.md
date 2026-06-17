# Deploying Bumply to Railway (with GitHub CI/CD)

Bumply is a standard Next.js app. Railway builds it with Nixpacks and runs `npm run start`.
`next start` binds to Railway's `PORT` automatically. Health check: `/api/health`.

## 1. CI (GitHub Actions)
`.github/workflows/ci.yml` runs `npm ci && npm run build` (type-check + compile) on every
push to `main` / `dev-shinzii` and on PRs. This is your build gate.

## 2. CD — two options

### Option A (recommended): Railway native GitHub deploy
1. In Railway → **New Project → Deploy from GitHub repo** → pick this repo.
2. Set the **branch** to deploy (e.g. `main` — merge `dev-shinzii` → `main` first, or deploy `dev-shinzii`).
3. Add a **Postgres**? No — Bumply uses your existing self-hosted Supabase/Railway Postgres via `SUPABASE_DB_URL`.
4. Add the env vars below.
5. Railway auto-deploys on every push to that branch. That's your CD. ✅

### Option B: deploy via GitHub Actions
Use `.github/workflows/deploy.yml`. Add repo secrets `RAILWAY_TOKEN` (a Railway **project token**)
and `RAILWAY_SERVICE` (the service name). It runs `railway up` on push to `main`.

## 3. Environment variables to set in Railway
Railway injects `PORT` and `RAILWAY_PUBLIC_DOMAIN` automatically. Bumply derives its public URL
from `RAILWAY_PUBLIC_DOMAIN` if `APP_URL`/`PUBLIC_WEBHOOK_URL` aren't set — so webhooks just work.

**Required**
```
SUPABASE_DB_URL=postgresql://...        # your Postgres
DB_SCHEMA=preg_companion
NVIDIA_API_KEY=nvapi-...                 # AI + embeddings
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-8b-instruct
NVIDIA_EMBED_MODEL=nvidia/nv-embedqa-e5-v5
AUTH_SECRET=<openssl rand -hex 32>
ADMIN_PASSWORD=<strong password>
RESEND_API_KEY=re_...                    # email
EMAIL_FROM=Bumply <onboarding@resend.dev>
CRON_SECRET=<openssl rand -hex 16>
```

**Telegram (reliable chat) — auto-registers its webhook on boot**
```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=<openssl rand -hex 16>
TELEGRAM_BOT_USERNAME=bumply_bot
```

**Voice (Modal)**
```
MODAL_TTS_URL=https://chidi-ashinze--buildsmall-tts-tts-web.modal.run
MODAL_ASR_URL=https://chidi-ashinze--buildsmall-whisper-asr-web.modal.run
MODAL_API_KEY=ns_...
```

**Search (Meilisearch) + Push (VAPID) + optional**
```
MEILI_URL=...   MEILI_KEY=...   MEILI_INDEX=kb
VAPID_PUBLIC_KEY=...   VAPID_PRIVATE_KEY=...   VAPID_SUBJECT=mailto:hello@thebrandnerve.com
HF_TOKEN=                         # optional (KB translation)
GMAIL_USER=   GMAIL_APP_PASSWORD= # optional, used instead of Resend if set
# WhatsApp/Evolution (optional; Telegram is the primary channel now)
EVOLUTION_API_URL=  EVOLUTION_API_KEY=  EVOLUTION_INSTANCE=bumply  WHATSAPP_WEBHOOK_SECRET=
```

## 4. After the first deploy
1. Run the DB migration once: from your machine, `SUPABASE_DB_URL=... npm run db:setup`
   (or run it via `railway run npm run db:setup`).
2. Seed the knowledge base: `npm run kb:seed` (pgvector + Meili).
3. The **Telegram webhook auto-registers** to the Railway domain on boot (see startup logs).
4. Schedule cron: add Railway **cron** services (or an external scheduler) hitting:
   - `GET https://<domain>/api/cron/weekly?secret=$CRON_SECRET` (weekly)
   - `GET https://<domain>/api/cron/daily?secret=$CRON_SECRET` (daily)

That's it — pushes to your deploy branch now ship automatically.
