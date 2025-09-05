"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { getWagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();

export function Web3Provider({
  children,
  walletConnectProjectId,
}: {
  children: React.ReactNode;
  walletConnectProjectId?: string;
}) {
  return (
    <WagmiProvider config={getWagmiConfig(walletConnectProjectId)}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
