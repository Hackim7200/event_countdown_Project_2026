import { AppShell } from "@/features/shared/components/app-shell";
import { PrivacyScreen } from "@/features/privacy/screens/privacy-screen";

/** Same content as `/privacy/`; `/policy/` is a common store / legal URL. */
export default function PolicyPage() {
  return (
    <AppShell>
      <PrivacyScreen />
    </AppShell>
  );
}
