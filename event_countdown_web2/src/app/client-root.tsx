"use client";

import {
  AuthenticatorChromeFooter,
  AuthenticatorChromeHeader,
} from "@/src/app/auth/authenticator-chrome";
import { silentArchitectAuthTheme } from "@/src/app/auth/silent-architect-auth-theme";
import { AppFooter } from "@/src/features/todo/components/app-footer";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "@/src/app/auth/authenticator.css";
import { ConfigureAmplify } from "./configure-amplify";
import { Providers } from "./providers";

export function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConfigureAmplify />
      <ThemeProvider theme={silentArchitectAuthTheme}>
        <Authenticator
          className="tsa-authenticator"
          loginMechanisms={["email"]}
          components={{
            Header: AuthenticatorChromeHeader,
            Footer: AuthenticatorChromeFooter,
          }}
        >
          <Providers>
            <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
              <div className="flex min-h-0 flex-1 flex-col">{children}</div>
              <AppFooter />
            </div>
          </Providers>
        </Authenticator>
      </ThemeProvider>
    </>
  );
}
