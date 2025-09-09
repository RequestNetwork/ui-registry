"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Currency {
  id: string;
  name: string;
  symbol: string;
}

const currencies: Currency[] = [
  { id: "ETH-sepolia-sepolia", name: "Ethereum", symbol: "ETH" },
  { id: "FAU-sepolia", name: "Faucet Token", symbol: "FAU" },
  { id: "fUSDC-sepolia", name: "USD Coin", symbol: "USDC" },
];

interface CurrencySelectProps {
  onSubmit: (currency: string) => void;
}

export function CurrencySelect({ onSubmit }: CurrencySelectProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  const handleSubmit = () => {
    const currency = currencies.find((c) => c.id === selectedCurrency);
    if (currency) {
      onSubmit(currency.id);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select a currency</h3>
      <RadioGroup value={selectedCurrency} onValueChange={setSelectedCurrency}>
        <div className="space-y-2">
          {currencies.map((currency) => (
            <div key={currency.id} className="p-4">
              <label
                htmlFor={currency.id}
                className="flex items-center justify-between cursor-pointer w-full"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={currency.id} id={currency.id} />
                  <div>
                    <div className="font-medium">{currency.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {currency.symbol}
                    </div>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </RadioGroup>
      <Button
        onClick={handleSubmit}
        disabled={!selectedCurrency}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}
