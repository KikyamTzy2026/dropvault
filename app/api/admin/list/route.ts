import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await sql`
    SELECT id, original_name, size_bytes, download_count, created_at, expires_at, deleted
    FROM files
    ORDER BY created_at DESC
    LIMIT 200
  `;

  return NextResponse.json({ files });
}
