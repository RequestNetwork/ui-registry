"use client";

import { useState, type PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionHandler } from "./components/connection-handler";
import { Web3Provider } from "@/components/providers/web3-provider";
import { PaymentModal } from "./components/payment-modal";
import { PaymentWidgetProps } from "./types";
import Image from "next/image";

function PaymentWidgetInner({
  children,
  amountInUsd,
  walletAccount,
  recipientWallet,
  paymentConfig,
  uiConfig,
  invoiceInfo,
  onSuccess,
  onError,
}: Omit<PaymentWidgetProps, "paymentConfig"> & {
  paymentConfig: Omit<
    PaymentWidgetProps["paymentConfig"],
    "walletConnectProjectId"
  >;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  return (
    <div className="inline-flex flex-col items-center">
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="ghost"
        className="p-0 h-auto bg-transparent hover:bg-transparent"
      >
        {children || "Pay with crypto"}
      </Button>

      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
        <Image
          src="/assets/logo-sm.svg"
          alt="Request Network"
          width={10}
          height={10}
          className="flex-shrink-0"
        />
        <span>Powered by Request Network</span>
      </div>

      {walletAccount !== undefined ? (
        <PaymentModal
          walletAccount={walletAccount}
          isOpen={isModalOpen}
          handleModalOpenChange={handleModalOpenChange}
          amountInUsd={amountInUsd}
          recipientWallet={recipientWallet}
          paymentConfig={paymentConfig}
          uiConfig={{
            showInvoiceDownload: uiConfig?.showInvoiceDownload || true,
            showRequestScanUrl: uiConfig?.showRequestScanUrl || true,
          }}
          invoiceInfo={invoiceInfo}
          onSuccess={onSuccess}
          onError={onError}
        />
      ) : (
        <ConnectionHandler
          isOpen={isModalOpen}
          handleModalOpenChange={handleModalOpenChange}
          paymentModal={
            <PaymentModal
              walletAccount={walletAccount}
              isOpen={isModalOpen}
              handleModalOpenChange={handleModalOpenChange}
              amountInUsd={amountInUsd}
              recipientWallet={recipientWallet}
              paymentConfig={paymentConfig}
              uiConfig={{
                showInvoiceDownload: uiConfig?.showInvoiceDownload || true,
                showRequestScanUrl: uiConfig?.showRequestScanUrl || true,
              }}
              invoiceInfo={invoiceInfo}
              onSuccess={onSuccess}
              onError={onError}
            />
          }
        />
      )}
    </div>
  );
}

export function PaymentWidget({
  amountInUsd,
  recipientWallet,
  paymentConfig,
  invoiceInfo,
  onSuccess,
  onError,
  uiConfig,
  walletAccount,
  children,
}: PaymentWidgetProps) {
  return (
    <Web3Provider walletConnectProjectId={paymentConfig.walletConnectProjectId}>
      <PaymentWidgetInner
        amountInUsd={amountInUsd}
        walletAccount={walletAccount}
        recipientWallet={recipientWallet}
        uiConfig={uiConfig}
        paymentConfig={{
          rnApiKey: paymentConfig.rnApiKey,
          feeInfo: paymentConfig.feeInfo,
          network: paymentConfig.network,
          supportedCurrencies: paymentConfig.supportedCurrencies,
        }}
        invoiceInfo={invoiceInfo}
        onSuccess={onSuccess}
        onError={onError}
      >
        {children}
      </PaymentWidgetInner>
    </Web3Provider>
  );
}
