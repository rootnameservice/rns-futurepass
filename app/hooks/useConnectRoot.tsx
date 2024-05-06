import "@therootnetwork/api-types"; // optional, for Typescript support
import { ApiPromise } from "@polkadot/api";
import {
  NetworkName,
  getApiOptions,
  getPublicProvider,
} from "@therootnetwork/api";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

export default function useConnectRoot(props?: ConnectProps) {
  const { address } = useAccount();

  const [api, setApi] = useState<ApiPromise>();
  const [fpAccount, setFpAccount] = useState<string>("");

  const getApiPromise = async (network: NetworkName = "root") => {
    const api = await ApiPromise.create({
      ...getApiOptions(),
      ...getPublicProvider(network),
    });

    setApi(api);
    return api;
  };

  const setup = async () => {
    const api = await getApiPromise();
    const [fpHolder, chain, chainId] = await Promise.all([
      api.query.futurepass.holders(address || ""),
      api.rpc.system.chain(),
      api.query.evmChainId.chainId(),
    ]);

    // Why does Porcini returns undefined after multiple calls?
    const fpAccount = fpHolder?.unwrapOr(undefined)?.toString();
    setFpAccount(fpAccount ?? "");
  };

  // Initial load only
  useEffect(() => {
    if (address && props?.state === "initialize") {
      setup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return { setup, api, getApiPromise, fpAccount };
}
