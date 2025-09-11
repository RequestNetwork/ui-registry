import { PaymentWidgetWrapper } from "./components/payment-widget-wrapper";

export default function Home() {
  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";
  const rnApiClientId = process.env.REQUEST_API_CLIENT_ID || "";
  const recipientWallet = process.env.RECIPIENT_WALLET || "";

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">RequestNetwork UI Registry</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Payment Widget Preview:</h2>
        <PaymentWidgetWrapper
          walletConnectProjectId={projectId}
          rnApiClientId={rnApiClientId}
          recipientWallet={recipientWallet}
        />
      </div>

      <div className="bg-primary p-4 rounded">
        <h3 className="font-semibold mb-2">Install this component:</h3>
        <code className="text-sm">
          npx shadcn add http://localhost:3000/r/payment-widget.json
        </code>
      </div>
    </main>
  );
}
