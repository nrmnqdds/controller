import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ArcadeProvider } from "./arcade";
import { ThemeProvider } from "./theme";
import { ConnectionProvider } from "./connection";
import { CartridgeAPIProvider } from "@cartridge/utils/api/cartridge";
import { IndexerAPIProvider } from "@cartridge/utils/api/indexer";
import { DataProvider } from "./data";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (
  typeof window !== "undefined" &&
  !window.location.hostname.includes("localhost")
) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY!, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: "always",
    enable_recording_console_log: true,
    loaded: (posthog) => {
      if (import.meta.env.NODE_ENV === "development") posthog.debug();
    },
  });
}

export function Provider({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();

  return (
    <PostHogProvider client={posthog}>
      <CartridgeAPIProvider
        url={`${import.meta.env.VITE_CARTRIDGE_API_URL!}/query`}
      >
        <IndexerAPIProvider credentials="omit">
          <QueryClientProvider client={queryClient}>
            <ArcadeProvider>
              <ConnectionProvider>
                <ThemeProvider defaultScheme="system">
                  <DataProvider>{children}</DataProvider>
                </ThemeProvider>
              </ConnectionProvider>
            </ArcadeProvider>
          </QueryClientProvider>
        </IndexerAPIProvider>
      </CartridgeAPIProvider>
    </PostHogProvider>
  );
}
