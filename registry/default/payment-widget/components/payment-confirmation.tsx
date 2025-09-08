"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import { type FeeInfo, type PaymentError, type BuyerInfo } from "../types";
import { useAccount, useSendTransaction } from "wagmi";
import { RN_API_URL } from "../constants";

interface PaymentConfirmationProps {
  rnApiKey: string;
  recipientWallet: string;
  feeInfo?: FeeInfo;
  buyerInfo: BuyerInfo;
  amountInUsd: string;
  paymentCurrency: string;

  onBack: () => void;
  onSuccess: (txHash: string) => void;
  onError: (error: PaymentError) => void;
}

const isPaymentError = (error: any): error is PaymentError => {
  return (
    error && typeof error === "object" && "type" in error && "error" in error
  );
};

export function PaymentConfirmation({
  amountInUsd,
  paymentCurrency,
  rnApiKey,
  recipientWallet,
  feeInfo,
  buyerInfo,
  onBack,
  onSuccess,
  onError,
}: PaymentConfirmationProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const { isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const executeTransactions = async (
    transactions: Array<{ to: string; data: string; value: { hex: string } }>,
  ) => {
    if (!isConnected) {
      return;
    }

    try {
      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];

        await sendTransactionAsync({
          to: tx.to as `0x${string}`,
          data: tx.data as `0x${string}`,
          value: BigInt(tx.value.hex),
        });
      }
    } catch (error) {
      console.error("Transaction execution failed:", error);
      throw { type: "transaction", error: error as Error };
    }
  };

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsExecuting(true);

    try {
      const response = await fetch(`${RN_API_URL}/v2/payouts`, {
        method: "POST",
        headers: {
          "x-api-key": rnApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInUsd,
          payee: recipientWallet,
          invoiceCurrency: "USD",
          paymentCurrency: paymentCurrency,
          feePercentage: feeInfo?.feePercentage || undefined,
          feeAddress: feeInfo?.feeAddress || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || "Failed to create payment");
        throw { type: "api", error };
      }

      const data = await response.json();

      if (data?.calldata?.transactions) {
        await executeTransactions(data.calldata.transactions);
      } else {
        const error = new Error("No transaction data received from backend");
        throw { type: "api", error };
      }
    } catch (error) {
      console.error("Error in payment flow:", error);
      if (isPaymentError(error)) {
        onError(error);
      } else {
        onError({ type: "unknown", error: error as Error });
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment Confirmation</h3>

      <div className="flex items-center justify-center space-x-4 p-6 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {amountInUsd} USD
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
          disabled={isExecuting || !isConnected}
        >
          {isExecuting ? "Processing..." : "Pay"}
        </Button>
      </div>
    </div>
  );
}
