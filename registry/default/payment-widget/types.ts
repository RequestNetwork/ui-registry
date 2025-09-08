export interface BuyerInfo {
  email: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface PaymentError {
  type: "api" | "transaction" | "unknown";
  error: Error;
}

export interface FeeInfo {
  feePercentage: string;
  feeAddress: string;
}
