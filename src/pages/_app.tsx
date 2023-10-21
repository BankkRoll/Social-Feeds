import type { AppProps } from "next/app";
import { useRouter } from 'next/router';
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
  trustWallet,
  rainbowWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import { ThemeProvider } from "../../components/ui/theme-provider";
import Navbar from "../../components/NavBar";
import { Toaster } from "../../components/ui/toaster"

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  return (
    <ThirdwebProvider
      activeChain="ethereum"
      clientId={clientId}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect(),
        localWallet(),
        embeddedWallet({ recommended: true }),
        trustWallet(),
        rainbowWallet(),
      ]}
    >
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
        {router.pathname !== '/[slug]' && <Navbar />}
        <Component {...pageProps} />
        <Toaster />
        </ThemeProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
