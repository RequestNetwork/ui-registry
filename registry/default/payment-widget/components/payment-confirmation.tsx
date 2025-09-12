"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePayment } from "@/hooks/use-payment";
import { getSymbolOverride, type ConversionCurrency } from "@/lib/currencies";
import { usePaymentWidgetContext } from "../context/payment-widget-context";
import type { BuyerInfo, PaymentError } from "@/types";

interface PaymentConfirmationProps {
  selectedCurrency: ConversionCurrency;
  buyerInfo: BuyerInfo;
  onBack: () => void;
  handlePaymentSuccess: (requestId: string) => void;
}

export function PaymentConfirmation({
  selectedCurrency,
  onBack,
  handlePaymentSuccess,
}: PaymentConfirmationProps) {
  const {
    amountInUsd,
    recipientWallet,
    connectedWalletAddress,
    paymentConfig: { rnApiClientId, feeInfo },
    onError,
  } = usePaymentWidgetContext();
  const { isExecuting, executePayment } = usePayment();

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connectedWalletAddress) return;

    try {
      const { requestId } = await executePayment(rnApiClientId, {
        payerWallet: connectedWalletAddress,
        amountInUsd,
        recipientWallet,
        paymentCurrency: selectedCurrency.id,
        feeInfo,
      });

      handlePaymentSuccess(requestId);
    } catch (error) {
      onError?.(error as PaymentError);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment Confirmation</h3>

      <div className="flex items-center justify-center space-x-6 p-6 bg-muted rounded-lg">
        {/* Payment Currency (From) */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
            {getSymbolOverride(selectedCurrency.symbol)}
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="text-sm font-medium text-foreground">
              {selectedCurrency.name}
            </div>
          </div>
        </div>

        <ArrowRight className="w-6 h-6 text-muted-foreground" />

        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            USD
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">To</div>
            <div className="text-sm font-medium text-foreground">
              ${amountInUsd}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Payment Destination</h4>
        <div className="p-3 bg-muted rounded-lg">
          <span className="text-sm font-mono text-foreground">
            {recipientWallet}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isExecuting}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleExecutePayment}
          className="flex-1"
          disabled={isExecuting}
        >
          {isExecuting ? "Processing..." : "Pay"}
        </Button>
      </div>
    </div>
  );
}
