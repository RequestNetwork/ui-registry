"use client";

import { PaymentWidget } from "@/registry/default/payment-widget/payment-widget";
import type { WalletClient } from "viem";

interface PaymentWidgetWrapperProps {
  recipientWallet: string;
  walletAccount?: WalletClient;
}

export function PaymentWidgetWrapper({
  recipientWallet,
  walletAccount,
}: PaymentWidgetWrapperProps) {
  const walletConnectProjectId =
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";
  const rnApiClientId = process.env.NEXT_PUBLIC_REQUEST_API_CLIENT_ID || "";

  const handleSuccess = async (requestId: string) => {
    console.log("Payment successful:", requestId);
  };

  const handleError = async (error: any) => {
    console.error("Payment failed:", error);
  };

  return (
    <PaymentWidget
      amountInUsd="1.00"
      recipientWallet={recipientWallet}
      walletAccount={walletAccount}
      paymentConfig={{
        walletConnectProjectId,
        rnApiClientId,
        supportedCurrencies: [
          "ETH-sepolia-sepolia",
          "fUSDT-sepolia",
          "FAU-sepolia",
          //"USDCn-matic",
        ],
        feeInfo: undefined /* {
          feeAddress: "0xEbe98659e162e8fF3520EC71e097C9e0a4F53829",
          feePercentage: "10",
        },*/,
      }}
      receiptInfo={{
        buyerInfo: {
          firstName: "Testo",
          email: "kerry@test.net",
        },
        companyInfo: {
          name: "Request Network Inc.",
          address: {
            street: "123 Crypto Street",
            city: "San Francisco",
            state: "CA",
            postalCode: "94105",
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
            unitPrice: "10.0",
            total: "10.0",
            currency: "USD",
          },
        ],
        totals: {
          totalDiscount: "0",
          totalTax: "0",
          total: "10.0",
          totalUSD: "10.0",
        },
      }}
      onPaymentSuccess={handleSuccess}
      onPaymentError={handleError}
    >
      <div className="flex p-3 bg-blue-500 items-center rounded-2xl text-white">
        Pay using crypto
      </div>
    </PaymentWidget>
  );
}
