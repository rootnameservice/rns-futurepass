"use client";

import React from "react";
import { Config, WagmiProvider } from "wagmi";
import { config } from "@/chains/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export interface WrapperProps {
  children?: React.ReactNode;
}

export const PageWrapper: React.FC<WrapperProps> = (props: WrapperProps) => {
  const { children } = props;
  return (
    <WagmiProvider config={config as unknown as Config}>
      {/* Tanstack Provider - Server side and needed by wagmi */}
      <QueryClientProvider client={queryClient}>
        {/* RTK Query Provider - Client side State Management */}
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default PageWrapper;
