-- Run this once against your Neon database (Neon SQL Editor, or psql) before first deploy.

CREATE TABLE IF NOT EXISTS files (
  id            TEXT PRIMARY KEY,          -- short public id, used in /d/[id]
  blob_url      TEXT NOT NULL,             -- Vercel Blob storage URL
  blob_pathname TEXT NOT NULL,             -- Blob pathname, needed to delete from Blob storage
  original_name TEXT NOT NULL,
  size_bytes    BIGINT NOT NULL,
  mime_type     TEXT,
  download_count INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL,
  deleted       BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_files_expires_at ON files (expires_at) WHERE deleted = false;
