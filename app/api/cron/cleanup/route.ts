import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expired = await sql`
    SELECT id, blob_pathname FROM files
    WHERE deleted = false AND expires_at <= now()
  `;

  let cleaned = 0;
  for (const row of expired as { id: string; blob_pathname: string }[]) {
    try {
      await del(row.blob_pathname);
    } catch (err) {
      console.error(`Failed to delete blob for ${row.id}:`, err);
    }
    await sql`UPDATE files SET deleted = true WHERE id = ${row.id}`;
    cleaned++;
  }

  return NextResponse.json({ cleaned });
}
