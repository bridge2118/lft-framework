import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

export default function useContract<T extends Contract = Contract>(
  address: string,
  ABI: any
): T | null {
  const { library, account, chainId } = useWeb3React();
  console.log('chain id', chainId, account, library)
  return useMemo(() => {
    console.log('in using contract')
    if (!address || !ABI || !library || !chainId) {
      return null;
    }

    try {
      console.log('got contract!!')
      return new Contract(address, ABI, library.getSigner(account));
    } catch (error) {
      console.error("Failed To Get Contract", error);

      return null;
    }
  }, [address, ABI, library, account]) as T;
}
