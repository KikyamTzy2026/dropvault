import { NextRequest, NextResponse } from "next/server";
import { getFile, isExpired, sql } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const file = await getFile(params.id);

  if (!file || isExpired(file)) {
    return NextResponse.json({ error: "Not found or expired" }, { status: 404 });
  }

  const upstream = await fetch(file.blob_url);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "File unavailable" }, { status: 502 });
  }

  await sql`UPDATE files SET download_count = download_count + 1 WHERE id = ${file.id}`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": file.mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${file.original_name}"`,
    },
  });
}
