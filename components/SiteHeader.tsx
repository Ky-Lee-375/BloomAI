import Link from "next/link";
import { BloomMark } from "./BloomMark";

interface SiteHeaderProps {
  activePath?: string;
}

export function SiteHeader({ activePath }: SiteHeaderProps) {
  const links = [
    { href: "/create", label: "Create" },
    { href: "/gallery", label: "Gallery" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <BloomMark className="h-8 w-8 text-forest" />
          <span className="font-display text-xl tracking-tight text-ink">Bouquet Creator</span>
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-xs uppercase tracking-[0.15em] transition-colors hover:text-mauve-dark ${
                activePath === link.href ? "text-mauve-dark" : "text-ink/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
