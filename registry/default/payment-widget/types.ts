import type { FeeInfo, PaymentError, InvoiceInfo } from "@/types";
import type { PropsWithChildren } from "react";
import type { WalletClient } from "viem";

export interface PaymentConfig {
  walletConnectProjectId?: string;
  network: "arbitrum" | "base" | "mainnet" | "optimism" | "polygon" | "sepolia";
  rnApiClientId: string;
  feeInfo?: FeeInfo;
  supportedCurrencies?: string[]; // an array of ticker symbols, e.g. ['ETH', 'USDC', 'DAI']
}

export interface UiConfig {
  showRequestScanUrl?: boolean;
  showInvoiceDownload?: boolean;
}

/*
Still TODO:
11. switch all props to be stored in context
*/

export interface PaymentWidgetProps extends PropsWithChildren {
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
  onSuccess?: (requestId: string) => void | Promise<void>;
  // On error callback when the payment fails
  onError?: (error: PaymentError) => void | Promise<void>;
}
