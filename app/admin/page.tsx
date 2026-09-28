"use client";

import { useState } from "react";
import Footer from "@/components/Footer";

type FileRow = {
  id: string;
  original_name: string;
  size_bytes: number;
  download_count: number;
  created_at: string;
  expires_at: string;
  deleted: boolean;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/list", {
        headers: { "x-admin-password": password },
      });
      if (!res.ok) throw new Error("Incorrect password");
      const data = await res.json();
      setFiles(data.files);
      setAuthed(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <main className="wrap">
        <div className="card">
          <h1>DropVault Admin</h1>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <button onClick={login} disabled={loading}>
            {loading ? "Checking…" : "Log in"}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
        <Footer variant="admin" />
        <Style />
      </main>
    );
  }

  return (
    <main className="wrap wide">
      <div className="card wide">
        <h1>DropVault Admin</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Downloads</th>
              <th>Uploaded</th>
              <th>Expires</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.id}>
                <td>{f.original_name}</td>
                <td>{formatBytes(f.size_bytes)}</td>
                <td>{f.download_count}</td>
                <td>{new Date(f.created_at).toLocaleString()}</td>
                <td>{new Date(f.expires_at).toLocaleString()}</td>
                <td>
                  {f.deleted
                    ? "Deleted"
                    : new Date(f.expires_at) <= new Date()
                    ? "Expired"
                    : "Active"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer variant="admin" />
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
      .wrap.wide { justify-content: flex-start; }
      .card { width: 100%; max-width: 420px; text-align: center; }
      .card.wide { max-width: 900px; text-align: left; margin-top: 2rem; }
      h1 { font-size: 1.4rem; margin-bottom: 1.25rem; }
      input {
        display: block;
        width: 100%;
        padding: 0.6rem;
        margin-bottom: 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--border, #e5e5ea);
        background: var(--bg, #fff);
        color: var(--fg, #16161a);
      }
      button {
        width: 100%;
        padding: 0.7rem;
        border-radius: 8px;
        border: none;
        background: var(--accent, #4f46e5);
        color: white;
        font-weight: 500;
        cursor: pointer;
      }
      .error { color: #e5484d; font-size: 0.85rem; margin-top: 0.75rem; }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.85rem;
        overflow-x: auto;
      }
      th, td {
        padding: 0.6rem 0.5rem;
        border-bottom: 1px solid var(--border, #e5e5ea);
        text-align: left;
      }
      th { color: var(--muted, #6b6b76); font-weight: 500; }
    `}</style>
  );
}
