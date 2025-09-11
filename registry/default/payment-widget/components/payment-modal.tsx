"use client";

import { useAccount } from "wagmi";
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
import { type PaymentWidgetProps } from "../types";
import { DisconnectWallet } from "./disconnect-wallet";
import { ConversionCurrency } from "@/lib/currencies";

interface PaymentModalProps extends Omit<PaymentWidgetProps, "paymentConfig"> {
  paymentConfig: Omit<
    PaymentWidgetProps["paymentConfig"],
    "walletConnectProjectId"
  >;
  isOpen: boolean;
  handleModalOpenChange: (open: boolean) => void;
}

export function PaymentModal({
  walletAccount,
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
  const [selectedCurrency, setSelectedCurrency] =
    useState<ConversionCurrency | null>(null);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | undefined>(
    invoiceInfo.buyerInfo || undefined,
  );
  const [requestId, setRequestId] = useState<string>("");

  const { address } = useAccount();

  const handleCurrencySelect = (currency: ConversionCurrency) => {
    setSelectedCurrency(currency);
    setActiveStep("buyer-info");
  };

  const handleBuyerInfoSubmit = (data: BuyerInfo) => {
    setBuyerInfo(data);
    setActiveStep("payment-confirmation");
  };

  const handlePaymentSuccess = async (requestId: string) => {
    setRequestId(requestId);
    setActiveStep("payment-success");
    await onSuccess?.(requestId);
  };

  const isWalletOverride = walletAccount !== undefined;
  const connectedWalletAddress = walletAccount
    ? walletAccount.account?.address
    : address;

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Pay with crypto using Request Network
          </DialogDescription>
        </DialogHeader>

        {activeStep !== "payment-success" && !isWalletOverride && (
          <DisconnectWallet />
        )}

        {activeStep === "currency-select" && (
          <CurrencySelect
            onSubmit={handleCurrencySelect}
            rnApiClientId={paymentConfig.rnApiClientId}
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
          connectedWalletAddress &&
          selectedCurrency &&
          buyerInfo && (
            <PaymentConfirmation
              amountInUsd={amountInUsd}
              connectedWalletAddress={connectedWalletAddress}
              walletAccount={walletAccount}
              recipientWallet={recipientWallet}
              handlePaymentSuccess={handlePaymentSuccess}
              handlePaymentError={onError}
              paymentCurrency={selectedCurrency}
              feeInfo={paymentConfig.feeInfo}
              rnApiClientId={paymentConfig.rnApiClientId}
              onBack={() => setActiveStep("buyer-info")}
            />
          )}

        {activeStep === "payment-success" &&
          selectedCurrency &&
          buyerInfo &&
          connectedWalletAddress && (
            <PaymentSuccess
              requestId={requestId}
              amountInUsd={amountInUsd}
              paymentCurrency={selectedCurrency.id}
              invoiceInfo={invoiceInfo}
              finalBuyerInfo={buyerInfo}
              connectedWalletAddress={connectedWalletAddress}
              shouldShowInvoiceDownload={uiConfig?.showInvoiceDownload || true}
              shouldShowRequestScanUrl={uiConfig?.showRequestScanUrl || true}
            />
          )}
      </DialogContent>
    </Dialog>
  );
}
