import { HomePage } from "./components/homepage";
import { PaymentWidgetWrapper } from "./components/payment-widget-wrapper";
import { ViemAccountDemo } from "./components/viem-account-demo";

export default function Home() {
  const recipientWallet =
    process.env.RECIPIENT_WALLET ||
    "0x0000000000000000000000000000000000000000";

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <HomePage recipientWallet={recipientWallet} />
    </main>
  );
}
