import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import { injected } from "../utils/connectors";
import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { formatEtherscanLink, shortenHex } from "../utils/util";
import ETHBalance from "../components/ETHBalance";
import TokenBalance from "../components/TokenBalance";
const LFT_TOKEN_ADDRESS = "0xbD3b3a6E98a63D846676D59523cbC0462dcF6153";
import { Menu } from '@headlessui/react';

import { Button, Card, Badge } from "antd";
import useLFTContract from "@/hooks/useLFTContract";
type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, chainId, account, setError } =
    useWeb3React();
  // console.log('this is ', account)

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  const ENSName = useENSName(account);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    return (
      <div>
        {isWeb3Available ? (
          <Button
            disabled={connecting}
            onClick={() => {
              setConnecting(true);
              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
            }}
          >
            {isMetaMaskInstalled ? "Connect MetaMask" : "Connect Wallet"}
          </Button>
        ) : (
          <Button onClick={startOnboarding}>Install Metamask</Button>
        )}
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block z-50">
      <Menu.Button className="text-blue-600">
        Wallet
      </Menu.Button>
      <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
        <Menu.Item as="div" >
          <Badge status="success" /> Connected
        </Menu.Item>
        <Menu.Item as="div" >
          <ETHBalance />
        </Menu.Item>
        <Menu.Item as="div" >
          <TokenBalance tokenAddress={LFT_TOKEN_ADDRESS} symbol="LFT" />
        </Menu.Item >
      </Menu.Items>
      {/* <Card><Badge status="success" /> Metamask Connected
        < p > Address: {ENSName || `${shortenHex(account, 10)}`}</p >
        <TokenBalance tokenAddress={LFT_TOKEN_ADDRESS} symbol="LFT" />
      </Card> */}
    </Menu >

  );
};

export default Account;
