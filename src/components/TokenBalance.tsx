import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useTokenBalance from "../hooks/useTokenBalance";
import { parseBalance } from "../utils/util";

type TokenBalanceProps = {
  tokenAddress: string;
  symbol: string;
};

const TokenBalance = ({ tokenAddress, symbol }: TokenBalanceProps) => {
  console.log('symbol', symbol)
  console.log('symbol address', tokenAddress)
  const { account } = useWeb3React<Web3Provider>();
  const { data } = useTokenBalance(account, tokenAddress);
  // console.log(account)
  // console.log(data)

  return (
    <div>
      {`${symbol} Balance`}: {parseBalance(data ?? 0)}
    </div>
  );
};

export default TokenBalance;
