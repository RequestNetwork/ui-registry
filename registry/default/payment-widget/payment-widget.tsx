"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionHandler } from "./components/connection-handler";
import { Web3Provider } from "@/components/providers/web3-provider";
import { PaymentModal } from "./components/payment-modal";

export function PaymentWidget({
  amountInUsd,
  walletConnectProjectId,
}: {
  amountInUsd: string;
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
        paymentModal={
          <PaymentModal
            amountInUsd={amountInUsd}
            isOpen={isModalOpen}
            handleModalOpenChange={handleModalOpenChange}
          />
        }
      />
    </Web3Provider>
  );
}
