import {
  type FeeInfo,
  type PaymentError,
  type Transaction,
} from "@/types/payment";
import { RN_API_URL } from "@/registry/default/payment-widget/constants";

export interface PaymentParams {
  amountInUsd: string;
  recipientWallet: string;
  paymentCurrency: string;
  feeInfo?: FeeInfo;
}

// Best to use the return value of useSendTransaction from wagmi directly
type SendTransactionFunction = (tx: {
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
}) => Promise<string>;

export const isPaymentError = (error: any): error is PaymentError => {
  return (
    error && typeof error === "object" && "type" in error && "error" in error
  );
};

export const executeTransactions = async (
  transactions: Transaction[],
  sendTransaction: SendTransactionFunction,
): Promise<string> => {
  let lastTxHash = "";

  try {
    for (const tx of transactions) {
      lastTxHash = await sendTransaction({
        to: tx.to as `0x${string}`,
        data: tx.data as `0x${string}`,
        value: BigInt(tx.value.hex),
      });
    }

    return lastTxHash;
  } catch (error) {
    console.error("Transaction execution failed:", error);
    throw { type: "transaction", error: error as Error } as PaymentError;
  }
};

export const createPayout = async (
  rnApiKey: string,
  params: PaymentParams,
): Promise<Response> => {
  const { amountInUsd, recipientWallet, paymentCurrency, feeInfo } = params;

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

  return response;
};

export const executePayment = async ({
  paymentParams,
  rnApiKey,
  sendTransaction,
}: {
  rnApiKey: string;
  paymentParams: PaymentParams;
  sendTransaction: SendTransactionFunction;
}): Promise<string> => {
  try {
    const response = await createPayout(rnApiKey, paymentParams);

    if (!response.ok) {
      let errorMessage = "Failed to create payment";

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (_parsingError) {
        // If we can't parse the error response, just use status text
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      const error = new Error(errorMessage);
      throw { type: "api", error } as PaymentError;
    }

    const data = await response.json();

    if (data?.calldata?.transactions) {
      return await executeTransactions(
        data.calldata.transactions,
        sendTransaction,
      );
    } else {
      const error = new Error("No transaction data received from backend");
      throw { type: "api", error } as PaymentError;
    }
  } catch (error) {
    console.error("Error in payment flow:", error);
    if (isPaymentError(error)) {
      throw error;
    } else {
      throw { type: "unknown", error: error as Error } as PaymentError;
    }
  }
};
