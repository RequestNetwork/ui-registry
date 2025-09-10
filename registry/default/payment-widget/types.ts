import { type FeeInfo, type PaymentError, InvoiceInfo } from "@/types";

export interface PaymentConfig {
  walletConnectProjectId?: string;
  network: "arbitrum" | "base" | "mainnet" | "optimism" | "polygon" | "sepolia";
  rnApiKey: string;
  feeInfo?: FeeInfo;
  supportedCurrencies?: string[]; // an array of ticker symbols, e.g. ['ETH', 'USDC', 'DAI']
}

export interface UiConfig {
  showRequestScanUrl?: boolean;
  showInvoiceDownload?: boolean;
}

/*
5. send over the signer for overriding our wagmi
*/

export interface PaymentWidgetProps {
  // The amount to be paid in USD
  amountInUsd: string;
  // The recipient wallet address for the payment
  recipientWallet: string;
  // Configuration for the payment widget
  paymentConfig: PaymentConfig;
  // UI specific config
  uiConfig?: UiConfig;
  // Invoice information
  invoiceInfo: InvoiceInfo;
  // On success callback when the payment is completed
  onSuccess?: (requestId: string, txHash: string) => Promise<void>;
  // On error callback when the payment fails
  onError?: (error: PaymentError) => Promise<void>;
}
