import { Address, encodeFunctionData } from "viem";
import { EMPTY_ADDRESS } from "@/constants/components";
import { porcini } from "@/chains/porcini";
import { useAccount } from "wagmi";
import { estimateGas, getFeeHistory } from "@wagmi/core";
import { config } from "@/chains/config";
import { Keyring } from "@polkadot/api";
import { Extrinsic } from "@polkadot/types/interfaces/types";
import { createExtrinsicPayload } from "@/utils/futurepass";

import useConnectRoot from "./useConnectRoot";
import * as EthRegistrarController from "../abis/root/ETHRegistrarController.json";

export type PaymentMethod = "ROOT" | "USDC";

export interface Payment {
  label: PaymentMethod;
  address: Address;
  decimals: number;
}

export interface RegisterProps {
  nameHash?: Address;
  args?: {
    name: string;
    owner?: Address;
    duration: number;
    secret: string;
    resolverAddr: Address;
    payment?: Payment;
    futurePassAddress?: string;
    addressRecord?: string;
  };
}

export default function useMakeCommitment() {
  const { getApiPromise } = useConnectRoot();
  const { address: walletAddress, chainId } = useAccount();

  const controller = EthRegistrarController;

  const makeCommitment = async (props: RegisterProps) => {
    const { nameHash, args } = props;
    const api = await getApiPromise("porcini");

    // TODO: Check which dependency causes to make the unwrapOr function not available in Codec
    let fpAccount = (await api.query.futurepass.holders(walletAddress || ""))
      .unwrapOr(undefined)
      ?.toString();

    if (!fpAccount && chainId === porcini.id) {
      fpAccount = EMPTY_ADDRESS;
    }

    console.log("fpAccount:: ", fpAccount);

    if (nameHash && args && fpAccount) {
      // Get transaction data using encodeFunctionData
      const data = encodeFunctionData({
        abi: controller.abi,
        functionName: "makeCommitment",
        args: [
          args.name,
          fpAccount,
          args.duration,
          args.secret,
          args.resolverAddr,
          [args.addressRecord],
          false,
          0,
        ],
      });

      // Estimate Contract Gas
      const estimatedGas = await estimateGas(config, {
        account: walletAddress,
        to: controller.address as Address,
        data,
      });
      const gasLimit = Number(estimatedGas);

      // Get Fee History
      const feeHistory = await getFeeHistory(config, {
        blockCount: 2,
        rewardPercentiles: [25, 75],
      });
      const maxFee = feeHistory.baseFeePerGas[0] || BigInt(7500000000000);
      const maxFeePerGas = Number(maxFee);

      // TODO: Unused - how to implement signer and use it
      const keyring = new Keyring({ type: "ethereum" });
      const signer = keyring.addFromAddress(walletAddress ?? "");

      // Prepare Transaction Call
      const evmCall = api.tx.evm.call(
        fpAccount,
        controller.address,
        data,
        0,
        gasLimit,
        maxFeePerGas,
        0,
        null,
        []
      );

      // Call ProxyExtrinsic
      const extrinsic = api.tx.futurepass.proxyExtrinsic(
        fpAccount ?? "",
        evmCall
      );

      // Create Extrinsic Payload and Sign it?
      const { payload, message } = await createExtrinsicPayload({
        api,
        signer: walletAddress ?? "",
        extrinsic,
      });

      // Get the user to sign
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      });

      console.log("signature:: ", signature);

      // Add the signature to the extrinsic
      const signedExtrinsic = extrinsic.addSignature(
        fpAccount ?? "",
        signature as `0x${string}`,
        payload
      );

      // TODO: Create a wrapper
      const result = await api.tx(signedExtrinsic).send();
      //   const result = await sendExtrinsic({ extrinsic, signer: alice });
      console.log("---------------------");
    }
  };

  const register = async () => {};

  return {
    register,
    makeCommitment,
  };
}
