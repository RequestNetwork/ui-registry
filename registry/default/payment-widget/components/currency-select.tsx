"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { getConversionCurrencies } from "@/lib/currencies";

interface CurrencySelectProps {
  rnApiKey: string;
  network: string;
  onSubmit: (currency: string) => void;
}

export function CurrencySelect({
  onSubmit,
  network,
  rnApiKey,
}: CurrencySelectProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const {
    data: conversionCurrencies,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["conversion-currencies"],
    queryFn: async () => getConversionCurrencies(rnApiKey, network),
  });

  const handleSubmit = () => {
    if (selectedCurrency === null) return;
    onSubmit(selectedCurrency);
  };

  if (isLoading) {
    return <div>Loading currencies...</div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-red-500">
          Error loading currencies. Please try again later.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!conversionCurrencies || conversionCurrencies.length === 0) {
    return <div>No conversion currencies available.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select a currency</h3>
      <RadioGroup value={selectedCurrency} onValueChange={setSelectedCurrency}>
        <div className="space-y-2 overflow-y-auto max-h-60">
          {conversionCurrencies.map((currency) => (
            <div key={currency.id} className="p-4">
              <label
                htmlFor={currency.id}
                className="flex items-center justify-between cursor-pointer w-full"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={currency.id} id={currency.id} />
                  <div>
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
