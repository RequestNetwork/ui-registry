"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { getWagmiConfig } from "@/lib/wagmi";
import { useMemo } from "react";

const queryClient = new QueryClient();

export function Web3Provider({
  children,
  walletConnectProjectId,
}: {
  children: React.ReactNode;
  walletConnectProjectId?: string;
}) {
  const wagmiConfig = useMemo(
    () => getWagmiConfig(walletConnectProjectId),
    [walletConnectProjectId],
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
