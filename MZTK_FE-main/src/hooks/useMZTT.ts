import { useState, useEffect, useCallback } from "react";
import { formatUnits } from "ethers";
import { useWallet } from "./useWallet";
import { useContract } from "./useContract";
import { ERC20_ABI } from "../abi/ERC20";

export const useMZTT = (tokenAddress: string) => {
    const { account } = useWallet();
    const contract = useContract(tokenAddress, ERC20_ABI);

    const [balance, setBalance] = useState<string>("0");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = useCallback(async () => {
        if (!contract) {
            console.warn("useMZTT: Contract is null");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // decimals 조회 (보통 18이지만 다를 수 있음)
            const decimals = await contract.decimals();
            const rawBalance = await contract.balanceOf(account);

            console.log(`[useMZTT] Fetching balance for ${account}`);
            console.log(`[useMZTT] Contract Address: ${await contract.getAddress()}`);
            console.log(`[useMZTT] Raw Balance: ${rawBalance.toString()}`);
            console.log(`[useMZTT] Decimals: ${decimals}`);

            const formattedBalance = formatUnits(rawBalance, decimals);
            setBalance(formattedBalance);
        } catch (err: any) {
            console.error("Failed to fetch MZTT:", err);
            setError(err.message || "Failed to fetch MZTT");
        } finally {
            setLoading(false);
        }
    }, [account, contract]);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    return {
        balance,
        loading,
        error,
        refetch: fetchBalance
    };
};
