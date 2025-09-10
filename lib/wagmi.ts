import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import {
  injected,
  walletConnect,
  coinbaseWallet,
  metaMask,
  safe,
} from "wagmi/connectors";

export const getWagmiConfig = (walletConnectProjectId?: string) => {
  const connectors = [
    injected(),
    coinbaseWallet({
      appName: "Request Network Payment",
    }),
    metaMask(),
    safe(),
  ];

  if (walletConnectProjectId) {
    connectors.push(
      walletConnect({
        projectId: walletConnectProjectId,
        metadata: {
          name: "Request Network Payment",
          description: "Pay with cryptocurrency using Request Network",
          url: "https://request.network",
          icons: [],
        },
      }) as any, // @TODO fix connector type
    );
  }

  const config = createConfig({
    chains: [mainnet, sepolia],
    connectors,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  });

  return config;
};
