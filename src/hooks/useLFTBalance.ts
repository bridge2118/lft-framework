import useSWR from "swr";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useLFTContract from "./useLFTContract";
import { useState } from "react";

export default function useTokenBalance(
  address: string,
  tokenAddress: string,
  suspense = false
) {
  const contract = useLFTContract(tokenAddress);
  // console.log('lftttttttttttt', contract)
  // console.log("use token contract:", contract)
  const shouldFetch =
    typeof address === "string" &&
    typeof tokenAddress === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["TokenBalance", address, tokenAddress] : null,
    ([, address]) => contract.balanceOf(address),
    {
      suspense,
    }
  );

  return result;
}
