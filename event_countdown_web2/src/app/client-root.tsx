"use client";

import { AppFooter } from "@/src/features/todo/components/app-footer";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { usePathname } from "next/navigation";
import { ConfigureAmplify } from "./configure-amplify";
import { Providers } from "./providers";

/** Routes that render `SiteFooter` inside `AppShell` — skip global `AppFooter`. */
function appShellOwnsFooter(pathname: string): boolean {
  const base = pathname.replace(/\/$/, "") || "/";
  return base === "/" || base === "/support" || base === "/privacy";
}

export function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideGlobalFooter = appShellOwnsFooter(pathname);

  return (
    <>
      <ConfigureAmplify />
      <Authenticator>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            {!hideGlobalFooter && <AppFooter />}
          </div>
        </Providers>
      </Authenticator>
    </>
  );
}
