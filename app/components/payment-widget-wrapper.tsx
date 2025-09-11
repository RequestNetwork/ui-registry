"use client";

import { PaymentWidget } from "@/registry/default/payment-widget/payment-widget";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

interface PaymentWidgetWrapperProps {
  walletConnectProjectId: string;
  rnApiClientId: string;
  recipientWallet: string;
}

export function PaymentWidgetWrapper({
  walletConnectProjectId,
  rnApiClientId,
  recipientWallet,
}: PaymentWidgetWrapperProps) {
  const handleSuccess = async (requestId: string) => {
    console.log("Payment successful:", requestId);
  };

  const handleError = async (error: any) => {
    console.error("Payment failed:", error);
  };

  /*
  // Example of creating a test wallet client (not used in the component)
  // It's probably better to just use wagmi, but it can be done this way too

  const testWallet = createWalletClient({
    account: privateKeyToAccount("some private key"),
    chain: sepolia,
    transport: http(),
  });
  */

  return (
    <PaymentWidget
      amountInUsd="10.00"
      recipientWallet={recipientWallet}
      walletAccount={undefined}
      paymentConfig={{
        walletConnectProjectId,
        rnApiClientId,
        network: "sepolia",
        supportedCurrencies: [], //["ETH-sepolia", "fUSDT", "FAU"],
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
    >
      <div className="flex p-3 bg-blue-500 items-center rounded-2xl text-white">
        Pay using crypto
      </div>
    </PaymentWidget>
  );
}
