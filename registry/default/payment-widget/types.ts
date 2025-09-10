import { type FeeInfo, type PaymentError, InvoiceInfo } from "@/types";

export interface PaymentConfig {
  walletConnectProjectId?: string;
  network: "arbitrum" | "base" | "mainnet" | "optimism" | "polygon" | "sepolia";
  rnApiKey: string;
  feeInfo?: FeeInfo;
}

export interface PaymentWidgetProps {
  // The amount to be paid in USD
  amountInUsd: string;
  // The recipient wallet address for the payment
  recipientWallet: string;
  // Configuration for the payment widget
  config: PaymentConfig;
  // Invoice information
  invoiceInfo: InvoiceInfo;
  // On success callback when the payment is completed
  onSuccess: (txHash: string) => void;
  // On error callback when the payment fails
  onError: (error: PaymentError) => void;
}
