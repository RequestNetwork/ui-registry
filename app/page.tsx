import { promises as fs } from "fs";
import path from "path";
import { HomePage } from "./components/homepage";

export default async function Home() {
  const recipientWallet =
    process.env.RECIPIENT_WALLET ||
    "0x0000000000000000000000000000000000000000";

  // Load README content
  const readmePath = path.join(
    process.cwd(),
    "registry/default/payment-widget/README.md",
  );
  const readmeContent = await fs.readFile(readmePath, "utf8");

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <HomePage
        recipientWallet={recipientWallet}
        readmeContent={readmeContent}
      />
    </main>
  );
}
