import { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { executePayment, PaymentParams } from "@/lib/payment";
import { type FeeInfo, type PaymentError } from "@/types/payment";

export const usePayment = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const execute = async (
    rnApiKey: string,
    params: PaymentParams,
  ): Promise<string> => {
    if (!isConnected) {
      throw {
        type: "wallet",
        error: new Error("Wallet not connected"),
      } as PaymentError;
    }

    setIsExecuting(true);

    try {
      const txHash = await executePayment({
        rnApiKey,
        paymentParams: {
          amountInUsd: params.amountInUsd,
          recipientWallet: params.recipientWallet,
          paymentCurrency: params.paymentCurrency,
          feeInfo: params.feeInfo,
        },
        sendTransaction: sendTransactionAsync,
      });

      return txHash;
      // no need to catch and rethrow PaymentError, just let it propagate
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    isExecuting,
    executePayment: execute,
  };
};
