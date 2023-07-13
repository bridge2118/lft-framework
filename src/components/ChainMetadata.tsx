import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import { injected } from "../utils/connectors";
import useENSName from "../hooks/useENSName";
import useLFTContract from "../hooks/useLFTContract"
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { formatEtherscanLink, shortenHex } from "../utils/util";
import ETHBalance from "./ETHBalance";
import TokenBalance from "./TokenBalance";
const LFT_TOKEN_ADDRESS = "0xbD3b3a6E98a63D846676D59523cbC0462dcF6153";

import { Button, Card, Badge } from "antd";
type AccountProps = {
  triedToEagerConnect: boolean;
};

const ChainMetadata = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, chainId, account, setError } =
    useWeb3React();
  // console.log('this is ', account)

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  const [chainName, setChainName] = useState('nothing');

  const ENSName = useENSName(account);
  const contract = useLFTContract(LFT_TOKEN_ADDRESS);
  console.log(contract)
  // const shouldFetch =
  //   typeof LFT_TOKEN_ADDRESS === "string" &&
  //   !!contract;

  // const result = useSWR(
  //   shouldFetch ? ["TokenBalance", address, tokenAddress] : null,
  //   ([, address]) => contract.balanceOf(address),
  //   {
  //     suspense,
  //   }
  // );
  const helloWorld = async () => {
    let name = await contract.helloWorld()
    alert(name)
    let transferResult = await contract.mint("0x5cBae6A65578b7C118963bf88f09e2149C3Cedfd", 100000000000000000)
    console.log(transferResult)
    // let balance = await contract.balanceOf("0xC100ac46699E2ef1D2450505c53aD6e685AB377D")
    // console.log('balance', balance)
  }
  // useEffect(() => {
  //   if (chainName == 'nothing') {
  //     console.log('fetching name')
  //     contract.name().then((name) => { console.log('nameeee', name); setChainName(name) })
  //   }
  // }, [chainName]);
  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  return (
    <Card title="Chain metadata" bordered={false} style={{ width: 300 }}>
      <Badge status="success" /> Metamask Connected
      <p>ChainName: {chainName}</p>
      <Button onClick={helloWorld}>test me</Button>
    </Card >

  );
};

export default ChainMetadata;
