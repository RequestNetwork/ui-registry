"use client";

import { useConnect } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WalletConnectModalProps {
  isOpen: boolean;
  handleModalOpenChange: (open: boolean) => void;
}

export function WalletConnectModal({
  isOpen,
  handleModalOpenChange,
}: WalletConnectModalProps) {
  const { connectors, connect, isPending } = useConnect();

  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  const getWalletIcon = (connectorName: string) => {
    switch (connectorName.toLowerCase()) {
      case "metamask":
        return "🦊";
      case "walletconnect":
        return "🔗";
      case "coinbase wallet":
      case "coinbase":
        return "🔵";
      case "injected":
        return "💳";
      default:
        return "👛";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect and make your payment
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
                <span className="text-2xl">
                  {getWalletIcon(connector.name)}
                </span>
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
  );
}
