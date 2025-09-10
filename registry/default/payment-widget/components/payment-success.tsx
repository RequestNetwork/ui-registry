"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Download } from "lucide-react";
import { createInvoice, type CreateInvoiceParams } from "@/lib/invoice";
import Link from "next/link";
import { useRef } from "react";
import { InvoicePDFTemplate } from "@/components/invoice/invoice-template";
import html2pdf from "html2pdf.js";
import { type BuyerInfo, type InvoiceInfo } from "@/types";

interface PaymentSuccessProps {
  requestId: string;
  amountInUsd: string;
  paymentCurrency: string;
  invoiceInfo: InvoiceInfo;
  finalBuyerInfo: BuyerInfo;
  connectedWalletAddress: string;
}

export function PaymentSuccess({
  requestId,
  amountInUsd,
  paymentCurrency,
  invoiceInfo,
  finalBuyerInfo,
  connectedWalletAddress,
}: PaymentSuccessProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoiceParams: CreateInvoiceParams = {
    company: invoiceInfo.companyInfo,
    buyer: {
      ...finalBuyerInfo,
      walletAddress: connectedWalletAddress,
    },
    payment: {
      chain: "ethereum",
      currency: paymentCurrency,
      exchangeRate: 1,
      transactionHash: "",
    },
    items: invoiceInfo.items,
    totals: invoiceInfo.totals,
    metadata: {
      ...(invoiceInfo.invoiceNumber && {
        invoiceNumber: invoiceInfo.invoiceNumber,
      }),
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
          filename: `invoice-${invoiceParams.metadata?.invoiceNumber || "payment"}.pdf`,
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
