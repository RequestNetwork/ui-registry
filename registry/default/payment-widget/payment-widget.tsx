"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionHandler } from "./components/connection-handler";
import { Web3Provider } from "@/components/providers/web3-provider";
import { PaymentModal } from "./components/payment-modal";
import { PaymentWidgetProps } from "./types";

function PaymentWidgetInner({
  amountInUsd,
  rnApiKey,
  recipientWallet,
  feeInfo,
  onSuccess,
  onError,
}: Omit<PaymentWidgetProps, "walletConnectProjectId">) {
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
            rnApiKey={rnApiKey}
            recipientWallet={recipientWallet}
            feeInfo={feeInfo}
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
  walletConnectProjectId,
  rnApiKey,
  recipientWallet,
  feeInfo,
  onSuccess,
  onError,
}: PaymentWidgetProps) {
  // We need to wrap the widget in the Web3Provider to provide wagmi context and so it doesn't rerender every time the modal opens or closes
  return (
    <Web3Provider walletConnectProjectId={walletConnectProjectId}>
      <PaymentWidgetInner
        amountInUsd={amountInUsd}
        rnApiKey={rnApiKey}
        recipientWallet={recipientWallet}
        feeInfo={feeInfo}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Web3Provider>
  );
}
