export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  finalAmount: number;
}

export interface CompanyInfo {
  name: string;
  walletAddress: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  taxId: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface InvoiceBuyerInfo {
  walletAddress: string;
  email: string;
  firstName?: string;
  lastName?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
}

export interface PaymentInfo {
  chain: string;
  currency: string;
  exchangeRate: number;
  transactionHash?: string;
}

export interface InvoiceMetadata {
  invoiceNumber: string;
  issueDate: Date;
  notes?: string;
}

export interface InvoiceData {
  metadata: InvoiceMetadata;
  company: CompanyInfo;
  buyer: InvoiceBuyerInfo;
  payment: PaymentInfo;
  items: InvoiceItem[];
  totals: {
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    total: number;
    totalUSD: number;
  };
}

export const calculateItemTotal = (
  item: Omit<InvoiceItem, "finalAmount">,
): InvoiceItem => {
  const baseAmount = item.quantity * item.unitPrice;
  const discountAmount = item.discount ? (baseAmount * item.discount) / 100 : 0;
  const afterDiscount = baseAmount - discountAmount;
  const taxAmount = item.tax ? (afterDiscount * item.tax) / 100 : 0;
  const finalAmount = afterDiscount + taxAmount;

  return {
    ...item,
    finalAmount: Number(finalAmount.toFixed(6)), // Crypto precision
  };
};

export const calculateInvoiceTotals = (
  items: InvoiceItem[],
  exchangeRate: number,
) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const totalDiscount = items.reduce((sum, item) => {
    const baseAmount = item.quantity * item.unitPrice;
    return sum + (item.discount ? (baseAmount * item.discount) / 100 : 0);
  }, 0);
  const totalTax = items.reduce((sum, item) => {
    const baseAmount = item.quantity * item.unitPrice;
    const afterDiscount =
      baseAmount - (item.discount ? (baseAmount * item.discount) / 100 : 0);
    return sum + (item.tax ? (afterDiscount * item.tax) / 100 : 0);
  }, 0);
  const total = items.reduce((sum, item) => sum + item.finalAmount, 0);
  const totalUSD = total * exchangeRate;

  return {
    subtotal: Number(subtotal.toFixed(6)),
    totalDiscount: Number(totalDiscount.toFixed(6)),
    totalTax: Number(totalTax.toFixed(6)),
    total: Number(total.toFixed(6)),
    totalUSD: Number(totalUSD.toFixed(2)),
  };
};

export const generateInvoiceNumber = (prefix: string = "INV"): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

export const formatWalletAddress = (
  address: string,
  startChars: number = 6,
  endChars: number = 4,
): string => {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const formatCryptoAmount = (
  amount: number,
  currency: string,
  decimals: number = 6,
): string => {
  return `${amount.toFixed(decimals)} ${currency}`;
};

export const formatUSDAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats dates for invoice display
 */
export const formatInvoiceDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export interface CreateInvoiceParams {
  company: CompanyInfo;
  buyer: InvoiceBuyerInfo;
  payment: PaymentInfo;
  items: Omit<InvoiceItem, "finalAmount">[];
  metadata?: Partial<InvoiceMetadata>;
}

export const createInvoice = (params: CreateInvoiceParams): InvoiceData => {
  const calculatedItems = params.items.map(calculateItemTotal);

  const totals = calculateInvoiceTotals(
    calculatedItems,
    params.payment.exchangeRate,
  );

  const metadata: InvoiceMetadata = {
    invoiceNumber: generateInvoiceNumber(),
    issueDate: new Date(),
    ...params.metadata,
  };

  const invoice: InvoiceData = {
    metadata,
    company: params.company,
    buyer: params.buyer,
    payment: params.payment,
    items: calculatedItems,
    totals,
  };

  return invoice;
};

export const getCompanyDisplayInfo = (company: CompanyInfo) => ({
  name: company.name,
  walletAddress: company.walletAddress,
  fullAddress: `${company.address.street}, ${company.address.city}, ${company.address.state} ${company.address.zipCode}`,
  taxId: company.taxId,
  contact: {
    email: company.email,
    phone: company.phone,
    website: company.website,
  },
});

export const getBuyerDisplayInfo = (buyer: InvoiceBuyerInfo) => ({
  walletAddress: buyer.walletAddress,
  email: buyer.email,
  fullName:
    [buyer.firstName, buyer.lastName].filter(Boolean).join(" ") || "N/A",
  fullAddress: buyer.address
    ? `${buyer.address.street}, ${buyer.address.city}, ${buyer.address.state} ${buyer.address.zipCode}`
    : "N/A",
});

export const getPaymentDisplayInfo = (payment: PaymentInfo) => ({
  chain: payment.chain.charAt(0).toUpperCase() + payment.chain.slice(1),
  currency: payment.currency,
  formattedRate: `1 ${payment.currency} = ${formatUSDAmount(payment.exchangeRate)}`,
  transactionHash: payment.transactionHash ?? undefined,
});

export const InvoiceUtils = {
  createInvoice,
  calculateItemTotal,
  calculateInvoiceTotals,
  generateInvoiceNumber,
  formatWalletAddress,
  formatCryptoAmount,
  formatUSDAmount,
  formatInvoiceDate,
  getCompanyDisplayInfo,
  getBuyerDisplayInfo,
  getPaymentDisplayInfo,
} as const;
