type FooterProps = {
  /** Main site footer vs. a lighter variant for the public download page / admin */
  variant?: "main" | "download" | "admin";
};

export default function Footer({ variant = "main" }: FooterProps) {
  const year = new Date().getFullYear();

  let line: string;
  if (variant === "download") {
    line = `Powered by DropVault · Created by Makoy ++`;
  } else if (variant === "admin") {
    line = `DropVault Admin · Created by Makoy ++`;
  } else {
    line = `© ${year} DropVault · Created by Makoy ++`;
  }

  return (
    <footer className="site-footer">
      <span className="site-footer-text">{line}</span>
      <style jsx>{`
        .site-footer {
          width: 100%;
          padding: 1.5rem 1rem 2rem;
          text-align: center;
        }
        .site-footer-text {
          font-size: 0.75rem;
          letter-spacing: 0.01em;
          color: var(--footer-fg, #8a8a94);
          opacity: 0.85;
          transition: opacity 0.15s ease, color 0.15s ease;
        }
        .site-footer-text:hover {
          opacity: 1;
          color: var(--footer-fg-hover, #6a6a75);
        }
      `}</style>
    </footer>
  );
}
