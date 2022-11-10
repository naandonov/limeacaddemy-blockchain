import LIBRARY_ABI from "../contracts/Library.json";
import type { Library } from "../contracts/types";
import useContract from "./useContract";

export default function useUSElectionContract(contractAddress?: string) {
  return useContract<Library>(contractAddress, LIBRARY_ABI);
}
