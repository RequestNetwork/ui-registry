export interface FeeInfo {
  feePercentage: number;
  feeAddress: string;
}

export interface PaymentError {
  type: "wallet" | "transaction" | "api" | "unknown";
  error: Error;
}

export interface Transaction {
  to: string;
  data: string;
  value: { hex: string };
}
