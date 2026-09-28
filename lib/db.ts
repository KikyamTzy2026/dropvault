import { neon } from "@neondatabase/serverless";

// Reuses the same query function across invocations (Neon's serverless driver
// is stateless over HTTP, so no pooling setup is required here).
export const sql = neon(process.env.DATABASE_URL!);

export type FileRecord = {
  id: string;
  blob_url: string;
  blob_pathname: string;
  original_name: string;
  size_bytes: number;
  mime_type: string | null;
  download_count: number;
  created_at: string;
  expires_at: string;
  deleted: boolean;
};

export async function getFile(id: string): Promise<FileRecord | null> {
  const rows = await sql`SELECT * FROM files WHERE id = ${id} AND deleted = false LIMIT 1`;
  return (rows[0] as FileRecord) ?? null;
}

export function isExpired(file: FileRecord): boolean {
  return new Date(file.expires_at).getTime() <= Date.now();
}
