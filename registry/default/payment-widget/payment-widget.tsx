"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionHandler } from "./components/connection-handler";
import { Web3Provider } from "@/components/providers/web3-provider";
import { PaymentModal } from "./components/payment-modal";
import { PaymentWidgetProps } from "./types";

function PaymentWidgetInner({
  amountInUsd,
  recipientWallet,
  config,
  invoiceInfo,
  onSuccess,
  onError,
}: Omit<PaymentWidgetProps, "config"> & {
  config: Omit<PaymentWidgetProps["config"], "walletConnectProjectId">;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Pay with Request Network
      </Button>
      <ConnectionHandler
        isOpen={isModalOpen}
        handleModalOpenChange={handleModalOpenChange}
        paymentModal={
          <PaymentModal
            isOpen={isModalOpen}
            handleModalOpenChange={handleModalOpenChange}
            amountInUsd={amountInUsd}
            recipientWallet={recipientWallet}
            config={config}
            invoiceInfo={invoiceInfo}
            onSuccess={onSuccess}
            onError={onError}
          />
        }
      />
    </>
  );
}

export function PaymentWidget({
  amountInUsd,
  recipientWallet,
  config,
  invoiceInfo,
  onSuccess,
  onError,
}: PaymentWidgetProps) {
  return (
    <Web3Provider walletConnectProjectId={config.walletConnectProjectId}>
      <PaymentWidgetInner
        amountInUsd={amountInUsd}
        recipientWallet={recipientWallet}
        config={{
          rnApiKey: config.rnApiKey,
          feeInfo: config.feeInfo,
          network: config.network,
        }}
        invoiceInfo={invoiceInfo}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Web3Provider>
  );
}
