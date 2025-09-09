"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Download } from "lucide-react";
import { createInvoice, type CreateInvoiceParams } from "@/lib/invoice";
import { type BuyerInfo } from "../types";
import Link from "next/link";
import { useRef } from "react";
import { InvoicePDFTemplate } from "@/components/invoice/invoice-template";
import html2pdf from "html2pdf.js";

interface PaymentSuccessProps {
  requestId: string;
  buyerInfo: BuyerInfo;
  amountInUsd: string;
  paymentCurrency: string;
}

export function PaymentSuccess({
  requestId,
  buyerInfo,
  amountInUsd,
  paymentCurrency,
}: PaymentSuccessProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoiceParams: CreateInvoiceParams = {
    company: {
      name: "Request Network Inc.",
      walletAddress: "0x742d35Cc6634C0532925a3b8D697Bf5e",
      address: {
        street: "123 Crypto Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
      },
      taxId: "US123456789",
      email: "hello@request.network",
      phone: "+1 (555) 123-4567",
      website: "https://request.network",
    },
    buyer: {
      walletAddress: "0x" + "0".repeat(40), // Mock buyer wallet
      email: buyerInfo.email,
      firstName: buyerInfo.firstName,
      lastName: buyerInfo.lastName,
      address: buyerInfo.streetAddress
        ? {
            street: buyerInfo.streetAddress,
            city: buyerInfo.city || "",
            state: buyerInfo.state || "",
            zipCode: buyerInfo.postalCode || "",
            country: buyerInfo.country || "",
          }
        : undefined,
    },
    payment: {
      chain: "ethereum",
      currency: paymentCurrency,
      exchangeRate: 1, // Mock exchange rate
      transactionHash: "", // We don't have the tx hash in this context
    },
    items: [
      {
        id: "1",
        description: "Payment via Request Network",
        quantity: 1,
        unitPrice: parseFloat(amountInUsd),
        discount: 0,
        tax: 0,
      },
    ],
    metadata: {
      notes: `Payment processed through Request Network for ${amountInUsd} USD`,
    },
  };

  const handleDownloadInvoice = async () => {
    try {
      const element = invoiceRef.current;
      if (!element) {
        console.error("Invoice element not found");
        return;
      }

      html2pdf()
        .set({
          margin: 1,
          filename: "invoice.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Failed to download invoice. Please try again.");
    }
  };

  const requestScanUrl = `https://scan.request.network/request/${requestId}`;

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="flex flex-col items-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-green-600">
            Payment Completed!
          </h3>
          <p className="text-gray-600 mt-2">
            Your payment of ${amountInUsd} has been processed successfully.
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-3 w-full">
        <Button onClick={handleDownloadInvoice} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download Invoice PDF
        </Button>

        <Button variant="outline" asChild className="w-full">
          <Link href={requestScanUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Request Scan
          </Link>
        </Button>
      </div>
      <div
        style={{
          height: 0,
          width: 0,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div ref={invoiceRef}>
          <InvoicePDFTemplate invoice={createInvoice(invoiceParams)} />
        </div>
      </div>
    </div>
  );
}
