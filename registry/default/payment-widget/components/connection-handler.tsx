"use client";

import { useAccount } from "wagmi";
import { WalletConnectModal } from "./wallet-connect-modal";
import { ReactNode } from "react";

interface ConnectionHandlerProps {
  isOpen: boolean;
  handleModalOpenChange: (open: boolean) => void;
  paymentModal: ReactNode;
}

export function ConnectionHandler({
  isOpen,
  handleModalOpenChange,
  paymentModal,
}: ConnectionHandlerProps) {
  const { isConnected, isConnecting } = useAccount();

  if (isConnecting) {
    // TODO loader
    return null;
  }

  if (!isConnected) {
    return (
      <WalletConnectModal
        isOpen={isOpen}
        handleModalOpenChange={handleModalOpenChange}
      />
    );
  }
  return paymentModal;
}
