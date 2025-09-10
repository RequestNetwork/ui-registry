import { type FeeInfo, type PaymentError } from "@/types";
import { RN_API_URL } from "@/registry/default/payment-widget/constants";

export interface PaymentParams {
  amountInUsd: string;
  payerWallet: string;
  recipientWallet: string;
  paymentCurrency: string;
  feeInfo?: FeeInfo;
}

interface PayoutAPITransaction {
  to: string;
  data: string;
  value: number | string | { type: string; hex: string };
}
export interface PayoutAPIResponse {
  requestId: string;
  paymentReference: string;
  transactions: PayoutAPITransaction[];
  metadata: {
    stepsRequired: number;
    needsApproval: boolean;
    approvalTransactionIndex: number;
    paymentTransactionIndex: number;
  };
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

export const normalizeValue = (
  value: PayoutAPITransaction["value"],
): bigint => {
  // ERC20 tokens don't have a bignumber returned
  if (typeof value === "number") {
    return BigInt(value);
  }

  if (typeof value === "string") {
    return BigInt(value);
  }

  if (typeof value === "object" && value !== null && "hex" in value) {
    return BigInt(value.hex);
  }

  // Fallback to 0 if we can't parse it
  console.warn("Unknown value format, defaulting to 0:", value);
  return BigInt(0);
};

export const executeTransactions = async (
  transactions: PayoutAPITransaction[],
  sendTransaction: SendTransactionFunction,
): Promise<string> => {
  let lastTxHash = "";

  try {
    for (const tx of transactions) {
      lastTxHash = await sendTransaction({
        to: tx.to as `0x${string}`,
        data: tx.data as `0x${string}`,
        value: normalizeValue(tx.value),
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
  const {
    amountInUsd,
    payerWallet,
    recipientWallet,
    paymentCurrency,
    feeInfo,
  } = params;

  const response = await fetch(`${RN_API_URL}/v2/payouts`, {
    method: "POST",
    headers: {
      "x-api-key": rnApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInUsd,
      payerWallet: payerWallet,
      payee: recipientWallet,
      invoiceCurrency: "USD",
      paymentCurrency: paymentCurrency,
      feePercentage: feeInfo?.feePercentage || undefined,
      feeAddress: feeInfo?.feeAddress || undefined,
    }),
  });

  return response;
};

export interface PaymentResponse {
  txHash: string;
  requestId: string;
}

export const executePayment = async ({
  paymentParams,
  rnApiKey,
  sendTransaction,
}: {
  rnApiKey: string;
  paymentParams: PaymentParams;
  sendTransaction: SendTransactionFunction;
}): Promise<PaymentResponse> => {
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

    const data: PayoutAPIResponse = await response.json();

    if (data?.transactions) {
      const txHash = await executeTransactions(
        data.transactions,
        sendTransaction,
      );

      return { txHash, requestId: data.requestId };
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
