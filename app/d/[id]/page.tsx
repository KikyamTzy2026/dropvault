import { getFile, isExpired, sql } from "@/lib/db";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DownloadPage({
  params,
}: {
  params: { id: string };
}) {
  const file = await getFile(params.id);

  if (!file || isExpired(file)) {
    return (
      <main className="wrap">
        <div className="card">
          <h1>Link expired</h1>
          <p className="muted">
            This file is no longer available. Files on DropVault are removed
            automatically after their set expiry time.
          </p>
        </div>
        <Footer variant="download" />
        <Style />
      </main>
    );
  }

  return (
    <main className="wrap">
      <div className="card">
        <h1>{file.original_name}</h1>
        <p className="muted">{formatBytes(file.size_bytes)}</p>
        <a className="download-btn" href={`/api/files/${file.id}`}>
          Download
        </a>
        <p className="expiry">
          Expires {new Date(file.expires_at).toLocaleString()}
        </p>
      </div>
      <Footer variant="download" />
      <Style />
    </main>
  );
}

function Style() {
  return (
    <style>{`
      .wrap {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem 1rem 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .card {
        width: 100%;
        max-width: 420px;
        text-align: center;
      }
      h1 {
        font-size: 1.4rem;
        word-break: break-word;
        margin-bottom: 0.4rem;
      }
      .muted {
        color: var(--muted, #6b6b76);
        font-size: 0.9rem;
        margin: 0 0 1.5rem;
      }
      .download-btn {
        display: inline-block;
        padding: 0.75rem 1.75rem;
        border-radius: 10px;
        background: var(--accent, #4f46e5);
        color: white;
        text-decoration: none;
        font-weight: 500;
      }
      .expiry {
        margin-top: 1.25rem;
        font-size: 0.75rem;
        color: var(--muted, #6b6b76);
      }
    `}</style>
  );
}
