import { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import {
  executePayment,
  PaymentParams,
  type PaymentResponse,
} from "@/lib/payment";
import { type PaymentError } from "@/types";

export const usePayment = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { isConnected, address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const execute = async (
    rnApiKey: string,
    params: PaymentParams,
  ): Promise<PaymentResponse> => {
    if (!isConnected || !address) {
      throw {
        type: "wallet",
        error: new Error("Wallet not connected"),
      } as PaymentError;
    }

    setIsExecuting(true);

    try {
      return await executePayment({
        rnApiKey,
        paymentParams: {
          amountInUsd: params.amountInUsd,
          payerWallet: address,
          recipientWallet: params.recipientWallet,
          paymentCurrency: params.paymentCurrency,
          feeInfo: params.feeInfo,
        },
        sendTransaction: sendTransactionAsync,
      });
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
