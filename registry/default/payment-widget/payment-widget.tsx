"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionHandler } from "./components/connection-handler";
import { Web3Provider } from "@/components/providers/web3-provider";

export function PaymentWidget({
  walletConnectProjectId,
}: {
  walletConnectProjectId?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  return (
    <Web3Provider walletConnectProjectId={walletConnectProjectId}>
      <Button onClick={() => setIsModalOpen(true)}>
        Pay with Request Network
      </Button>
      <ConnectionHandler
        isOpen={isModalOpen}
        handleModalOpenChange={handleModalOpenChange}
      />
    </Web3Provider>
  );
}
