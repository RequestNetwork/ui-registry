"use client";

import { useMemo, type ReactNode } from "react";
import { useAccount } from "wagmi";
import type { ReceiptInfo, PaymentError } from "../../types/index";
import type { TransactionReceipt, WalletClient } from "viem";
import type { PaymentWidgetProps } from "../../payment-widget.types";
import { PaymentWidgetContext, type PaymentWidgetContextValue } from "./index";

interface PaymentWidgetProviderProps {
  children: ReactNode;
  amountInUsd: string;
  recipientWallet: string;
  walletAccount?: WalletClient;
  paymentConfig: Omit<
    PaymentWidgetProps["paymentConfig"],
    "walletConnectProjectId"
  >;
  uiConfig?: PaymentWidgetProps["uiConfig"];
  receiptInfo: ReceiptInfo;
  onSuccess?: (
    requestId: string,
    transactionReceipts: TransactionReceipt[],
  ) => void | Promise<void>;
  onError?: (error: PaymentError) => void | Promise<void>;
}

export function PaymentWidgetProvider({
  children,
  amountInUsd,
  recipientWallet,
  walletAccount,
  paymentConfig,
  uiConfig,
  receiptInfo,
  onSuccess,
  onError,
}: PaymentWidgetProviderProps) {
  const { address } = useAccount();

  const isWalletOverride = walletAccount !== undefined;
  const connectedWalletAddress = walletAccount
    ? walletAccount.account?.address
    : address;

  const contextValue: PaymentWidgetContextValue = useMemo(
    () => ({
      amountInUsd,
      recipientWallet,
      walletAccount,
      connectedWalletAddress,
      isWalletOverride,
      paymentConfig: {
        rnApiClientId: paymentConfig.rnApiClientId,
        feeInfo: paymentConfig.feeInfo,
        supportedCurrencies: paymentConfig.supportedCurrencies,
      },
      uiConfig: {
        showReceiptDownload: uiConfig?.showReceiptDownload ?? true,
        showRequestScanUrl: uiConfig?.showRequestScanUrl ?? true,
      },
      receiptInfo,
      onSuccess,
      onError,
    }),
    [
      amountInUsd,
      recipientWallet,
      walletAccount,
      connectedWalletAddress,
      isWalletOverride,
      paymentConfig.rnApiClientId,
      paymentConfig.feeInfo,
      paymentConfig.supportedCurrencies,
      uiConfig?.showReceiptDownload,
      uiConfig?.showRequestScanUrl,
      receiptInfo,
      onSuccess,
      onError,
    ],
  );

  return (
    <PaymentWidgetContext.Provider value={contextValue}>
      {children}
    </PaymentWidgetContext.Provider>
  );
}
