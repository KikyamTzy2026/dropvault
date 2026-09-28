import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DropVault — Temporary file sharing",
  description:
    "DropVault: temporary file sharing. Simple. Secure. Automatic. Created by Makoy ++",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #16161a;
            --muted: #6b6b76;
            --border: #e5e5ea;
            --accent: #4f46e5;
            --footer-fg: #8a8a94;
            --footer-fg-hover: #55555f;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #0e0e11;
              --fg: #f2f2f5;
              --muted: #9a9aa5;
              --border: #26262c;
              --accent: #818cf8;
              --footer-fg: #6f6f7a;
              --footer-fg-hover: #9a9aa5;
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--fg);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
        `}</style>
      </body>
    </html>
  );
}
