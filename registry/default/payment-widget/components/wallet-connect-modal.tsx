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
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface WalletConnectModalProps {
  isOpen: boolean;
  isLoading: boolean;
  handleModalOpenChange: (open: boolean) => void;
}

export function WalletConnectModal({
  isOpen,
  isLoading,
  handleModalOpenChange,
}: WalletConnectModalProps) {
  const { connectors, connect, isPending } = useConnect();

  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  const getWalletIcon = (connectorName: string) => {
    const name = connectorName.toLowerCase();

    switch (true) {
      case name.includes("metamask"):
        return "/assets/metamask.svg";
      case name.includes("walletconnect"):
        return "/assets/wallet-connect.webp";
      case name.includes("coinbase"):
        return "/assets/coinbase.webp";
      case name.includes("safe"):
        return "/assets/safe.webp";
      default:
        return "/assets/wallet-icon.svg";
    }
  };

  // Filter out the generic injected connector, which needs to be in wagmi config otherwise types start breaking
  const displayConnectors = connectors.filter(
    (connector) => !connector.name.toLowerCase().includes("injected"),
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect and make your payment
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center text-sm text-muted-foreground py-2">
            <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {displayConnectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                variant="outline"
                className="w-full justify-start h-14"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={getWalletIcon(connector.name)}
                    alt={`${connector.name} icon`}
                    width={32}
                    height={32}
                    className="flex-shrink-0 rounded-md"
                  />
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
        )}
      </DialogContent>
    </Dialog>
  );
}
