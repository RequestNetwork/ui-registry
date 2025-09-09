"use client";

import { PaymentWidget } from "@/registry/default/payment-widget/payment-widget";

interface PaymentWidgetWrapperProps {
  walletConnectProjectId: string;
  rnApiKey: string;
  recipientWallet: string;
}

export function PaymentWidgetWrapper({
  walletConnectProjectId,
  rnApiKey,
  recipientWallet,
}: PaymentWidgetWrapperProps) {
  const handleSuccess = () => {
    console.log("Payment successful");
  };

  const handleError = (error: any) => {
    console.error("Payment failed:", error);
  };

  return (
    <PaymentWidget
      walletConnectProjectId={walletConnectProjectId}
      amountInUsd="1.00"
      rnApiKey={rnApiKey}
      recipientWallet={recipientWallet}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
