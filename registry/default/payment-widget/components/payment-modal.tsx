"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CurrencySelect } from "./currency-select";
import { BuyerInfoForm } from "./buyer-info-form";
import { PaymentConfirmation } from "./payment-confirmation";
import { PaymentSuccess } from "./payment-success";
import { type BuyerInfo } from "@/types";
import { UiConfig, type PaymentWidgetProps } from "../types";

interface PaymentModalProps extends Omit<PaymentWidgetProps, "paymentConfig"> {
  paymentConfig: Omit<
    PaymentWidgetProps["paymentConfig"],
    "walletConnectProjectId"
  >;
  isOpen: boolean;
  handleModalOpenChange: (open: boolean) => void;
}

export function PaymentModal({
  isOpen,
  handleModalOpenChange,
  amountInUsd,
  recipientWallet,
  paymentConfig,
  uiConfig,
  invoiceInfo,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const [activeStep, setActiveStep] = useState<
    | "currency-select"
    | "buyer-info"
    | "payment-confirmation"
    | "payment-success"
  >("currency-select");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | undefined>(
    invoiceInfo.buyerInfo || undefined,
  );
  const [requestId, setRequestId] = useState<string>("");

  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    handleModalOpenChange(false);
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setActiveStep("buyer-info");
  };

  const handleBuyerInfoSubmit = (data: BuyerInfo) => {
    setBuyerInfo(data);
    setActiveStep("payment-confirmation");
  };

  const handlePaymentSuccess = async (requestId: string, txHash: string) => {
    setRequestId(requestId);
    setActiveStep("payment-success");
    await onSuccess?.(requestId, txHash);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Pay with crypto using Request Network
          </DialogDescription>
        </DialogHeader>

        {activeStep !== "payment-success" && (
          <div className="p-2 space-y-4">
            <div className="border-t pt-4">
              <div className="flex flex-row items-center justify-between mb-2">
                <span className="text-sm font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button variant="ghost" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeStep === "currency-select" && (
          <CurrencySelect
            onSubmit={handleCurrencySelect}
            rnApiKey={paymentConfig.rnApiKey}
            network={paymentConfig.network}
            supportedCurrencies={paymentConfig.supportedCurrencies}
          />
        )}

        {activeStep === "buyer-info" && (
          <BuyerInfoForm
            initialData={buyerInfo}
            onBack={() => setActiveStep("currency-select")}
            onSubmit={handleBuyerInfoSubmit}
          />
        )}

        {activeStep === "payment-confirmation" &&
          selectedCurrency &&
          buyerInfo && (
            <PaymentConfirmation
              amountInUsd={amountInUsd}
              recipientWallet={recipientWallet}
              handlePaymentSuccess={handlePaymentSuccess}
              handlePaymentError={onError}
              paymentCurrency={selectedCurrency}
              feeInfo={paymentConfig.feeInfo}
              rnApiKey={paymentConfig.rnApiKey}
              onBack={() => setActiveStep("buyer-info")}
            />
          )}

        {activeStep === "payment-success" &&
          selectedCurrency &&
          buyerInfo &&
          address && (
            <PaymentSuccess
              requestId={requestId}
              amountInUsd={amountInUsd}
              paymentCurrency={selectedCurrency}
              invoiceInfo={invoiceInfo}
              finalBuyerInfo={buyerInfo}
              connectedWalletAddress={address}
              shouldShowInvoiceDownload={uiConfig?.showInvoiceDownload || true}
              shouldShowRequestScanUrl={uiConfig?.showRequestScanUrl || true}
            />
          )}
      </DialogContent>
    </Dialog>
  );
}
