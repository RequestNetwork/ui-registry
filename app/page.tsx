import { PaymentWidgetWrapper } from "./components/payment-widget-wrapper";
import { ViemAccountDemo } from "./components/viem-account-demo";

export default function Home() {
  const recipientWallet = process.env.RECIPIENT_WALLET || "";

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">RequestNetwork UI Registry</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Payment Widget Preview:
          </h2>
          <PaymentWidgetWrapper recipientWallet={recipientWallet} />
        </div>

        <div>
          <ViemAccountDemo recipientWallet={recipientWallet} />
        </div>
      </div>

      <div className="bg-primary p-4 rounded">
        <h3 className="font-semibold mb-2">Install this component:</h3>
        <code className="text-sm">
          npx shadcn add @requestnetwork/payment-widget
        </code>
      </div>
    </main>
  );
}
