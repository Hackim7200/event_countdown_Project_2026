import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

type AppShellProps = {
  children: ReactNode;
  /** `default` — narrow column; `wide` — same max width as app chrome (e.g. landing hero). */
  layout?: "default" | "wide";
};

export function AppShell({ children, layout = "default" }: AppShellProps) {
  const innerMax =
    layout === "wide" ? "max-w-[1200px]" : "max-w-2xl";

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <div
        className={`mx-auto flex min-h-full ${innerMax} flex-col px-6 py-10 sm:px-8 sm:py-14`}
      >
        <header className="mb-12">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
            The Silent Architect
          </p>
          <SiteNav />
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
