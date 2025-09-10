import { type FeeInfo, type PaymentError, InvoiceInfo } from "@/types";
import { WalletClient } from "viem";

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
Still TODO:
6. restyle everything
7. Connect with new client id on our API instead of the API key
8. Find out why wallet connect modal breaks
9. Deploy to shad properly
*/

export interface PaymentWidgetProps {
  // The amount to be paid in USD
  amountInUsd: string;
  // The recipient wallet address for the payment
  recipientWallet: string;
  // Override for the buyer's wallet account if you already have an active session
  walletAccount?: WalletClient;
  // Configuration for the payment widget
  paymentConfig: PaymentConfig;
  // UI specific config
  uiConfig?: UiConfig;
  // Invoice information
  invoiceInfo: InvoiceInfo;
  // On success callback when the payment is completed
  onSuccess?: (requestId: string) => Promise<void>;
  // On error callback when the payment fails
  onError?: (error: PaymentError) => Promise<void>;
}
