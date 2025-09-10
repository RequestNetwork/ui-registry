"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionHandler } from "./components/connection-handler";
import { Web3Provider } from "@/components/providers/web3-provider";
import { PaymentModal } from "./components/payment-modal";
import { PaymentWidgetProps } from "./types";

function PaymentWidgetInner({
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
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Pay with Request Network
      </Button>
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
    </>
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
      />
    </Web3Provider>
  );
}
