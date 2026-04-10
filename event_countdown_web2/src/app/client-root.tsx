"use client";

import { AppFooter } from "@/src/features/todo/components/app-footer";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { ConfigureAmplify } from "./configure-amplify";
import { Providers } from "./providers";

export function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConfigureAmplify />
      <Authenticator>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            <AppFooter />
          </div>
        </Providers>
      </Authenticator>
    </>
  );
}
