"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionHandler } from "./components/connection-handler";
import { Web3Provider } from "@/components/providers/web3-provider";
import { PaymentModal } from "./components/payment-modal";
import { type PaymentError, type FeeInfo } from "./types";

export interface PaymentWidgetProps {
  // The amount to be paid in USD
  amountInUsd: string;
  // Optional WalletConnect Project ID for connecting via WalletConnect
  walletConnectProjectId?: string;
  // RN API Key to use to access the Request Network API
  rnApiKey: string;
  // The recipient wallet address for the payment
  recipientWallet: string;
  // Optional fee info to include fees in the payment
  feeInfo?: FeeInfo;
  // On success callback when the payment is completed
  onSuccess: () => void;
  // On error callback when the payment fails
  onError: (error: PaymentError) => void;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };
  console.log("Rendering PaymentWidget with props:", rnApiKey, recipientWallet);

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
    </Web3Provider>
  );
}
