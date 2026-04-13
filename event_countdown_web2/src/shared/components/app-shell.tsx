import type { ReactNode } from "react";
import { AppHeader } from "@/src/features/todo/components/app-header";
import type { AppHeaderActiveNav } from "@/src/features/todo/components/app-header";

type AppShellProps = {
  children: ReactNode;
  /**
   * `wide` — full content width up to 1200px (e.g. landing hero).
   * `default` — centered column max 2xl for readable legal/support copy.
   */
  layout?: "default" | "wide";
  activeNav: AppHeaderActiveNav;
  showHeaderActions?: boolean;
};

export function AppShell({
  children,
  layout = "default",
  activeNav,
  showHeaderActions = true,
}: AppShellProps) {
  const inner =
    layout === "wide" ? (
      <div className="w-full">{children}</div>
    ) : (
      <div className="mx-auto w-full max-w-2xl">{children}</div>
    );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F8F9FA]">
      <AppHeader
        activeNav={activeNav}
        showHeaderActions={showHeaderActions}
      />
      <main className="relative flex-1">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 pb-28 md:px-8 md:py-10">
          {inner}
        </div>
      </main>
    </div>
  );
}
