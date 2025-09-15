"use client";

import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentWidgetWrapper } from "./payment-widget-wrapper";
import { useState } from "react";
import { Wallet, LogOut } from "lucide-react";

interface ViemAccountDemoProps {
  walletConnectProjectId: string;
  rnApiClientId: string;
  recipientWallet: string;
}

const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected(), metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Create a query client
const queryClient = new QueryClient();

function ViemAccountDemoInner({
  walletConnectProjectId,
  rnApiClientId,
  recipientWallet,
}: ViemAccountDemoProps) {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConnect = (connector: any) => {
    connect({ connector });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Use Viem Account</h3>

        {isConnected ? (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Connected: </span>
              <span className="font-mono text-xs">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <Button onClick={() => disconnect()} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect Wallet</DialogTitle>
                <DialogDescription>
                  Connect your wallet to use with the Payment Widget
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-4">
                {connectors.map((connector) => (
                  <Button
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    disabled={isPending}
                    variant="outline"
                    className="w-full justify-start h-14"
                  >
                    <div className="flex items-center space-x-3">
                      <Wallet className="w-8 h-8 text-muted-foreground" />
                      <div className="text-left">
                        <div className="font-medium">{connector.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Connect using {connector.name}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}

                {isPending && (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    Connecting to wallet...
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground mb-4">
          {isConnected
            ? "Your wallet is connected! The Payment Widget will use this account instead of prompting for wallet connection."
            : "Connect your wallet first, then the Payment Widget will use your connected account automatically."}
        </p>

        {isConnected && walletClient ? (
          <PaymentWidgetWrapper
            walletConnectProjectId={walletConnectProjectId}
            rnApiClientId={rnApiClientId}
            recipientWallet={recipientWallet}
            walletAccount={walletClient}
          />
        ) : (
          <div className="flex items-center justify-center h-12 bg-background border-2 border-dashed rounded">
            <span className="text-sm text-muted-foreground">
              {isConnected
                ? "Loading wallet client..."
                : "Connect wallet to enable Payment Widget"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ViemAccountDemo(props: ViemAccountDemoProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ViemAccountDemoInner {...props} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
