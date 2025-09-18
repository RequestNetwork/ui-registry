"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Copy, ExternalLink } from "lucide-react";
import { PaymentWidgetWrapper } from "./payment-widget-wrapper";
import { ViemAccountDemo } from "./viem-account-demo";

export function HomePage({ recipientWallet }: { recipientWallet: string }) {
  const [basicExampleOpen, setBasicExampleOpen] = useState(false);
  const [advancedExampleOpen, setAdvancedExampleOpen] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const apiUrl =
    process.env.NEXT_PUBLIC_REQUEST_API_URL || "https://api.request.network";

  const basicCode = `import { PaymentWidget } from "@/components/payment-widget/payment-widget";

export function BasicPayment() {
  return (
    <PaymentWidget
      amountInUsd="25.00"
      recipientWallet="0x742d35Cc6639C0532c29e54F3D4B48E4d7d5f1E0"
      paymentConfig={{
        rnApiClientId: <YOUR_CLIENT_ID>,
        supportedCurrencies: ["ETH-sepolia-sepolia", "FAU-sepolia", "USDC-mainnet"],
      }}
      receiptInfo={{
        companyInfo: {
          name: "Your Company Name",
          email: "contact@company.com",
        },
        buyerInfo: {
          email: "john.doe@example.com",
        },
        items: [{
          id: "1",
          description: "Product or Service",
          quantity: 1,
          unitPrice: "25.00",
          total: "25.00",
        }],
        totals: {
          total: "25.00",
          totalUSD: "25.00",
          totalDiscount: "0.00",
          totalTax: "0.00",
        },
      }}
      onSuccess={(requestId) => {
        console.log("Payment successful:", requestId);
      }}
      onError={(error) => {
        console.error("Payment failed:", error);
      }}
    >
      Pay $25 with Crypto
    </PaymentWidget>
  );
}`;

  const advancedCode = `import { PaymentWidget } from "@/components/payment-widget/payment-widget";
import { useWalletClient } from "wagmi";

export function PaymentWithWallet() {
  const { data: walletClient } = useWalletClient();
  
  return (
    <PaymentWidget
      amountInUsd="25.00"
      recipientWallet="0x742d35Cc6639C0532c29e54F3D4B48E4d7d5f1E0"
      walletAccount={walletClient} // Pass existing wallet
      paymentConfig={{
         rnApiClientId: <YOUR_CLIENT_ID>,
        supportedCurrencies: ["ETH-sepolia-sepolia", "FAU-sepolia", "USDC-mainnet"],
      }}
      receiptInfo={{
        companyInfo: {
          name: "Your Company Name",
          email: "contact@company.com",
        },
        buyerInfo: {
          email: "john.doe@example.com",
        },
        items: [{
          id: "1",
          description: "Product or Service",
          quantity: 1,
          unitPrice: "25.00",
          total: "25.00",
        }],
        totals: {
          total: "25.00",
          totalUSD: "25.00",
          totalDiscount: "0.00",
          totalTax: "0.00",
        },
      }}
      uiConfig={{
        showRequestScanUrl: true,
        showReceiptDownload: true,
      }}
      onSuccess={(requestId) => {
        console.log("Payment successful:", requestId);
      }}
      onError={(error) => {
        console.error("Payment failed:", error);
      }}
    >
      Pay with Connected Wallet
    </PaymentWidget>
  );
}`;

  const installationSteps = [
    {
      title: "Get your client ID",
      description:
        "Visit our OpenAPI docs to create a client ID using your Request Network API key",
      action: "Go to Request Network OpenAPI",
      link: `${apiUrl}/open-api/#tag/v2client-ids`,
    },
    {
      title: "Install shadcn/ui",
      description: "Follow the official shadcn/ui installation guide",
      action: "Visit Documentation",
      link: "https://ui.shadcn.com/docs/installation",
    },
    {
      title: "Add custom registry",
      description:
        "Open your components.json file and add the RequestNetwork registry",
      code: `// an example components.json file
      {
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@requestnetwork": "https://ui.stage.request.network/r/{name}.json" // Add this!
  }
}
`,
    },
    {
      title: "Add the payment widget",
      description: "Use the shadcn CLI to install the payment widget",
      code: "npx shadcn add @request-network/payment-widget",
    },
    {
      title: "Use the widget",
      description: "Import and use the PaymentWidget component in your app",
      code: basicCode,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <h1 className="text-4xl font-bold text-foreground">
              RequestNetwork UI Registry
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Beautiful, accessible components for integrating Request Network
            payments into your applications
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Examples
          </h2>

          <Card className="border-border">
            <Collapsible
              open={basicExampleOpen}
              onOpenChange={setBasicExampleOpen}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Without a user's wallet
                      </CardTitle>
                      <CardDescription>
                        Simple payment widget that handles wallet connection
                        internally
                      </CardDescription>
                    </div>
                    {basicExampleOpen ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Live Preview */}
                    <div className="p-6 rounded-lg border bg-card">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4">
                        Live Preview
                      </h3>
                      <PaymentWidgetWrapper recipientWallet={recipientWallet} />
                    </div>

                    {/* Code */}
                    <div className="relative">
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{basicCode}</pre>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(basicCode, 0)}
                      >
                        {copiedStep === 0 ? (
                          <span className="text-xs">Copied!</span>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="border-border">
            <Collapsible
              open={advancedExampleOpen}
              onOpenChange={setAdvancedExampleOpen}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        With an existing wallet
                      </CardTitle>
                      <CardDescription>
                        Payment widget that uses an existing wallet connection
                        from your app
                      </CardDescription>
                    </div>
                    {advancedExampleOpen ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="p-6 rounded-lg border bg-card">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4">
                        Live Preview
                      </h3>
                      <ViemAccountDemo recipientWallet={recipientWallet} />
                    </div>

                    <div className="relative">
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{advancedCode}</pre>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(advancedCode, 1)}
                      >
                        {copiedStep === 1 ? (
                          <span className="text-xs">Copied!</span>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Installation
          </h2>

          <div className="space-y-4">
            {installationSteps.map((step, index) => (
              <Card
                key={`installation-step-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index
                }`}
                className="border-border"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {step.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {step.link ? (
                    <Button
                      asChild
                      variant="outline"
                      className="w-fit bg-transparent"
                    >
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {step.action}
                      </a>
                    </Button>
                  ) : step.code ? (
                    <div className="relative">
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{step.code}</pre>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(step.code!, index + 10)}
                      >
                        {copiedStep === index + 10 ? (
                          <span className="text-xs">Copied!</span>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
