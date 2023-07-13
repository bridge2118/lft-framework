import LFT_ABI from "@/contracts/LFTABI.json";
// import type { ERC20 } from "../contracts/types";
import useContract from "./useContract";

export default function useLFTContract(tokenAddress?: string) {
  console.log('in lft contract')
  console.log('abi', LFT_ABI)
  console.log('token address', tokenAddress)
  return useContract(tokenAddress, LFT_ABI);
}
