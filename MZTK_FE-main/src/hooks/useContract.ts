import { useMemo } from "react";
import { Contract, type InterfaceAbi, BrowserProvider, type Eip1193Provider } from "ethers";
import { useWallet } from "./useWallet";

export const useContract = (address: string | undefined, abi: InterfaceAbi) => {
    // providerDetail might be null if auto-connected via window.ethereum
    const { providerDetail } = useWallet();

    return useMemo(() => {
        if (!address || !abi) return null;

        try {
            let provider;
            if (providerDetail) {
                provider = new BrowserProvider(providerDetail.provider as unknown as Eip1193Provider);
            } else if (window.ethereum) {
                // Fallback for auto-connect scenario
                provider = new BrowserProvider(window.ethereum);
            } else {
                return null;
            }

            return new Contract(address, abi, provider);
        } catch (error) {
            console.error("Failed to create contract instance", error);
            return null;
        }
    }, [address, abi, providerDetail]);
};
