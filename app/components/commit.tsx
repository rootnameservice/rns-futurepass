import React, { useEffect, useState } from "react";
import {
  Button as MuiButton,
  Grid,
  styled,
  Collapse,
  Typography,
} from "@mui/material";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { grey, pink } from "@mui/material/colors";
import { getMaskedAddress } from "@/utils/common";
import { root, rootWalletConfig } from "@/chains/root";
import { Address, encodeFunctionData, namehash } from "viem";

import * as PublicResolver from "../abis/root/PublicResolver.json";
import useConnectRoot from "@/hooks/useConnectRoot";
import useMakeCommitment from "@/hooks/useMakeCommitment";
import { SECONDS } from "@/constants/components";

const Button = styled(MuiButton)(({ theme }) => ({
  textTransform: "none",
  width: "100%",

  backgroundColor: pink[800],

  "&.MuiButton-contained": {
    "&.Mui-disabled": {
      backgroundColor: grey[700],
    },
    "&:hover": {
      backgroundColor: pink[900],
    },
  },
}));

const CommitmentGrid = styled(Grid)(({ theme }) => ({
  borderRadius: "8px",
  border: `solid 1px ${pink[700]}`,
  padding: "30px",
}));

const Label = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: grey[500],
  marginRight: "8px",
}));

const Value = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: grey[100],
}));

export const Commit: React.FC = () => {
  const connectors = useConnectors();

  const { address, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { fpAccount } = useConnectRoot({ state: "initialize" });
  const { makeCommitment } = useMakeCommitment();

  const [walletLabel, setWalletLabel] = useState("Connect Metamask Wallet");

  const createTestData = () => {
    const resolver = PublicResolver;
    const nameHash = namehash("futurepass-study.root") as Address;

    const addressRecord = encodeFunctionData({
      abi: resolver.abi,
      functionName: "setAddr",
      args: [nameHash, fpAccount],
    });

    const duration = SECONDS; // 1yr
    const secret = namehash("futurepass-study");
    const resolverAddr = resolver.address as Address;

    return {
      nameHash,
      name: "futurepass-study",
      owner: fpAccount as Address,
      duration,
      secret,
      resolverAddr,
      addressRecord,
    };
  };

  const switchNetwork = async (config: any) => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const result = await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [config],
        });
      } catch (error) {
        console.log("Error:: ", error);
      }
    }
  };

  const handleCommit = async () => {
    const args = createTestData();
    const { nameHash, ...props } = args;

    const response = await makeCommitment({
      nameHash,
      args: props,
    });
  };

  const handleConnect = () => {
    const connector = connectors?.filter((connector) => {
      return (
        connector.type !== "injected" ||
        (connector.type === "injected" && connector.id === "metaMask")
      );
    })[0];

    connect({ connector });
  };

  useEffect(() => {
    const label = address ? "Connected!" : "Connect Metamask Wallet";
    setWalletLabel(label);
  }, [address, fpAccount]);

  useEffect(() => {
    if (chainId !== root.id) {
      // Switch to mainnet
      switchNetwork(rootWalletConfig);
    }
  }, [chainId]);

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          onClick={() => {
            if (address) {
              disconnect();
            } else {
              handleConnect();
            }
          }}
        >
          {walletLabel}
        </Button>
        <Grid display="flex" justifyContent="space-between" mb={4}>
          <Grid display="flex">
            <Label>Wallet Address:</Label>
            <Value>{getMaskedAddress(address ?? "")}</Value>
          </Grid>
          <Grid display="flex">
            <Label>Futurepass:</Label>
            <Value>{getMaskedAddress(fpAccount ?? "")}</Value>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Collapse in={!!fpAccount} sx={{ mb: 2 }}>
          <CommitmentGrid>
            <Grid display="flex">
              <Label>Name:</Label>
              <Value>futurepass-study</Value>
            </Grid>
            <Grid display="flex">
              <Label>Owner:</Label>
              <Value>{fpAccount}</Value>
            </Grid>
            <Grid display="flex">
              <Label>Duration:</Label>
              <Value>1 year</Value>
            </Grid>
          </CommitmentGrid>
        </Collapse>
        <Button
          variant="contained"
          disabled={!address || !fpAccount}
          onClick={() => {
            handleCommit();
          }}
        >
          Make a commitment
        </Button>
      </Grid>
    </Grid>
  );
};

export default Commit;
