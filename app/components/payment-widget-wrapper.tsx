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
  const handleSuccess = async (requestId: string, txHash: string) => {
    console.log("Payment successful:", requestId, txHash);
  };

  const handleError = async (error: any) => {
    console.error("Payment failed:", error);
  };

  return (
    <PaymentWidget
      amountInUsd="10.00"
      recipientWallet={recipientWallet}
      paymentConfig={{
        walletConnectProjectId,
        rnApiKey,
        network: "sepolia",
        supportedCurrencies: ["ETH-sepolia", /*"fUSDT",*/ "FAU"],
      }}
      invoiceInfo={{
        buyerInfo: {
          firstName: "Testo",
          email: "kerry@test.net",
        },
        companyInfo: {
          name: "Request Network Inc.",
          walletAddress: recipientWallet,
          address: {
            street: "123 Crypto Street",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
          taxId: "US123456789",
          email: "hello@request.network",
          phone: "+1 (555) 123-4567",
          website: "https://request.network",
        },
        items: [
          {
            id: "1",
            description: "Payment via Request Network",
            quantity: 1,
            unitPrice: 10.0,
            total: 10.0,
            currency: "USD",
          },
        ],
        totals: {
          totalDiscount: 0,
          totalTax: 0,
          total: 10.0,
          totalUSD: 10.0,
        },
      }}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
