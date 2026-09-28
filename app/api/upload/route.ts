import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { sql } from "@/lib/db";

const ALLOWED_DURATIONS = new Set([3600, 86400, 604800]);
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const durationRaw = form.get("durationSeconds");
    const durationSeconds = Number(durationRaw);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_DURATIONS.has(durationSeconds)) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 400 });
    }

    const id = nanoid(10);
    const pathname = `dropvault/${id}-${file.name}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    });

    const expiresAt = new Date(Date.now() + durationSeconds * 1000);

    await sql`
      INSERT INTO files (id, blob_url, blob_pathname, original_name, size_bytes, mime_type, expires_at)
      VALUES (${id}, ${blob.url}, ${blob.pathname}, ${file.name}, ${file.size}, ${file.type}, ${expiresAt.toISOString()})
    `;

    return NextResponse.json({ id });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
