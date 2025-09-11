"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FeeInfo, type PaymentError } from "@/types";
import { type PaymentWidgetProps } from "../types";
import { usePayment } from "@/hooks/use-payment";
import { ConversionCurrency, getSymbolOverride } from "@/lib/currencies";

interface PaymentConfirmationProps {
  feeInfo: FeeInfo | undefined;
  rnApiClientId: string;
  amountInUsd: string;
  connectedWalletAddress: string;
  walletAccount?: PaymentWidgetProps["walletAccount"];
  recipientWallet: string;
  paymentCurrency: ConversionCurrency;
  onBack: () => void;
  handlePaymentSuccess: (requestId: string) => Promise<void>;
  handlePaymentError?: (error: PaymentError) => Promise<void>;
}

export function PaymentConfirmation({
  amountInUsd,
  paymentCurrency,
  rnApiClientId,
  connectedWalletAddress,
  recipientWallet,
  feeInfo,
  onBack,
  handlePaymentSuccess,
  handlePaymentError,
}: PaymentConfirmationProps) {
  const { isExecuting, executePayment } = usePayment();

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { requestId } = await executePayment(rnApiClientId, {
        payerWallet: connectedWalletAddress,
        amountInUsd,
        recipientWallet,
        paymentCurrency: paymentCurrency.id,
        feeInfo,
      });

      handlePaymentSuccess(requestId);
    } catch (error) {
      handlePaymentError?.(error as PaymentError);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment Confirmation</h3>

      <div className="flex items-center justify-center space-x-6 p-6 bg-muted rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
            {getSymbolOverride(paymentCurrency.symbol)}
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="text-sm font-medium text-foreground">
              {paymentCurrency.name}
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
