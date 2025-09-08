"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Currency } from "lucide-react";
import { CurrencySelect } from "./currency-select";
import { type BuyerInfo, BuyerInfoForm } from "./buyer-info-form";

interface PaymentModalProps {
  isOpen: boolean;
  handleModalOpenChange: (open: boolean) => void;
  amountInUsd: string;
}

export function PaymentModal({
  isOpen,
  handleModalOpenChange,
  amountInUsd,
}: PaymentModalProps) {
  const [activeStep, setActiveStep] = useState<
    "currency-select" | "buyer-info" | "payment-confirmation"
  >("currency-select");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | null>(null);

  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    handleModalOpenChange(false);
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setActiveStep("buyer-info");
  };

  const handleBuyerInfoSubmit = (data: BuyerInfo) => {
    setBuyerInfo(data);
    setActiveStep("payment-confirmation");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Pay with crypto using Request Network
          </DialogDescription>
        </DialogHeader>
        <div className="p-2 space-y-4">
          <div className="border-t pt-4">
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="text-sm font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <Button variant="ghost" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </div>
        </div>
        {activeStep === "currency-select" && (
          <CurrencySelect onSubmit={handleCurrencySelect} />
        )}
        {activeStep === "buyer-info" && (
          <BuyerInfoForm
            onBack={() => setActiveStep("currency-select")}
            onSubmit={handleBuyerInfoSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
