import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/todos", label: "Todos" },
  { href: "/events", label: "Events" },
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
] as const;

export function SiteNav() {
  return (
    <nav
      className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-zinc-200 pb-6 text-sm tracking-wide text-zinc-500"
      aria-label="Primary"
    >
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-zinc-800 transition-colors hover:text-zinc-950"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
