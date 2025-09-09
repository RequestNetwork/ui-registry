import { type FeeInfo, type PaymentError } from "@/types/payment";

export interface BuyerInfo {
  email: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

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
  onSuccess: (txHash: string) => void;
  // On error callback when the payment fails
  onError: (error: PaymentError) => void;
}
