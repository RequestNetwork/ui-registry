"use client";

import { useAccount } from "wagmi";
import { PaymentModal } from "./payment-modal";
import { WalletConnectModal } from "./wallet-connect-modal";

interface ConnectionHandlerProps {
  isOpen: boolean;
  handleModalOpenChange: (open: boolean) => void;
}

export function ConnectionHandler({
  isOpen,
  handleModalOpenChange,
}: ConnectionHandlerProps) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <WalletConnectModal
        isOpen={isOpen}
        handleModalOpenChange={handleModalOpenChange}
      />
    );
  }

  return (
    <PaymentModal
      isOpen={isOpen}
      handleModalOpenChange={handleModalOpenChange}
    />
  );
}
