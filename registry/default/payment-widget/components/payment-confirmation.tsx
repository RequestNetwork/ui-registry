"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import { FeeInfo, type PaymentError } from "@/types";
import { type PaymentWidgetProps } from "../types";
import { usePayment } from "@/hooks/use-payment";

interface PaymentConfirmationProps {
  feeInfo: FeeInfo | undefined;
  rnApiKey: string;
  amountInUsd: string;
  recipientWallet: string;
  paymentCurrency: string;
  onBack: () => void;
  onSuccess: (txHash: string) => void;
  onError: (error: PaymentError) => void;
}

export function PaymentConfirmation({
  amountInUsd,
  paymentCurrency,
  rnApiKey,
  recipientWallet,
  feeInfo,
  onBack,
  onSuccess,
  onError,
}: PaymentConfirmationProps) {
  const { isExecuting, executePayment } = usePayment();

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const txHash = await executePayment(rnApiKey, {
        amountInUsd,
        recipientWallet,
        paymentCurrency,
        feeInfo,
      });

      console.log("Payment completed with tx hash:", txHash);
      onSuccess(txHash);
    } catch (error) {
      onError(error as PaymentError);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment Confirmation</h3>

      <div className="flex items-center justify-center space-x-4 p-6 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            USD
          </div>
          <span className="text-sm text-gray-600 mt-2">From</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <ArrowDown className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            {paymentCurrency}
          </div>
          <span className="text-sm text-gray-600 mt-2">To</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Payment Destination</h4>
        <div className="p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-mono text-gray-700">
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
