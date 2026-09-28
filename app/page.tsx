"use client";

import { useState } from "react";
import Footer from "@/components/Footer";

const DURATIONS = [
  { label: "1 hour", value: "3600" },
  { label: "1 day", value: "86400" },
  { label: "7 days", value: "604800" },
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState("86400");
  const [uploading, setUploading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    setLink(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("durationSeconds", duration);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
      const data = await res.json();
      setLink(`${window.location.origin}/d/${data.id}`);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="wrap">
      <div className="card">
        <h1>DropVault</h1>
        <p className="tagline">Temporary file sharing. Simple. Secure. Automatic.</p>

        <div className="dropzone">
          <input
            type="file"
            id="file-input"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <label htmlFor="file-input">
            {file ? file.name : "Choose a file to upload"}
          </label>
        </div>

        <div className="duration-row">
          <span className="duration-label">Expires after</span>
          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            {DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? "Uploading…" : "Upload & get link"}
        </button>

        {error && <p className="error">{error}</p>}

        {link && (
          <div className="result">
            <input readOnly value={link} onFocus={(e) => e.target.select()} />
            <button
              className="copy"
              onClick={() => navigator.clipboard.writeText(link)}
            >
              Copy
            </button>
          </div>
        )}

        <p className="credit-line">Created by Makoy ++</p>
      </div>

      <Footer variant="main" />

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem 0;
        }
        .card {
          width: 100%;
          max-width: 440px;
          text-align: center;
        }
        h1 {
          font-size: 2rem;
          margin: 0 0 0.25rem;
          letter-spacing: -0.02em;
        }
        .tagline {
          color: var(--muted);
          margin: 0 0 2rem;
          font-size: 0.95rem;
        }
        .dropzone {
          border: 1.5px dashed var(--border);
          border-radius: 12px;
          padding: 2rem 1rem;
          margin-bottom: 1rem;
        }
        .dropzone input {
          display: none;
        }
        .dropzone label {
          cursor: pointer;
          color: var(--muted);
          font-size: 0.9rem;
        }
        .duration-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          font-size: 0.85rem;
        }
        .duration-label {
          color: var(--muted);
        }
        select {
          padding: 0.4rem 0.6rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--fg);
        }
        button {
          width: 100%;
          padding: 0.75rem;
          border-radius: 10px;
          border: none;
          background: var(--accent);
          color: white;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .error {
          color: #e5484d;
          font-size: 0.85rem;
          margin-top: 0.75rem;
        }
        .result {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.25rem;
        }
        .result input {
          flex: 1;
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--fg);
          font-size: 0.8rem;
        }
        .copy {
          width: auto;
          padding: 0.5rem 0.9rem;
        }
        .credit-line {
          margin-top: 3rem;
          font-size: 0.7rem;
          color: var(--footer-fg);
          opacity: 0.8;
          transition: opacity 0.15s ease, color 0.15s ease;
        }
        .credit-line:hover {
          opacity: 1;
          color: var(--footer-fg-hover);
        }
      `}</style>
    </main>
  );
}
