# DropVault

Temporary file sharing. Simple. Secure. Automatic.
Created by Makoy ++

## Stack
- Next.js 14 (App Router) — frontend + API routes
- Neon (serverless Postgres) — file metadata
- Vercel Blob — actual file storage
- Vercel Cron — hourly cleanup of expired files

## Setup

1. **Create a Neon database** at neon.tech. Copy its connection string.
2. **Run the schema**: open the Neon SQL Editor and paste the contents of `schema.sql`, then run it.
3. **Create a Vercel Blob store**: in your Vercel project → Storage → Blob → Create, then copy the `BLOB_READ_WRITE_TOKEN`.
4. Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL` (from Neon)
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Blob)
   - `ADMIN_PASSWORD` (pick your own — protects `/admin`)
   - `CRON_SECRET` (pick your own random string — protects the cleanup endpoint)
5. Install deps and run locally:
   ```
   npm install
   npm run dev
   ```
6. **Deploy to Vercel**:
   ```
   vercel deploy
   ```
   Then add the same environment variables in your Vercel project settings (Settings → Environment Variables) — `.env.local` is not deployed automatically.
7. Vercel Cron (configured in `vercel.json`) will call `/api/cron/cleanup` every hour, automatically deleting files whose `expires_at` has passed from both Blob storage and the database.

## Pages
- `/` — landing page, upload a file, choose expiry (1 hour / 1 day / 7 days), get a shareable link
- `/d/[id]` — public download page for a shared link
- `/admin` — password-protected dashboard listing all files, sizes, download counts, and status

## Notes
- Max upload size is 100MB (adjust `MAX_SIZE_BYTES` in `app/api/upload/route.ts` if needed).
- The admin dashboard uses a simple shared-password header check — fine for personal/small-team use, not meant as full multi-user auth.
