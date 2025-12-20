import { useState, useEffect, useCallback } from "react";
import { useWallet } from "./useWallet";
import { useContract } from "./useContract";

// 임시 ABI: 실제 컨트랙트에 맞게 수정 필요
const USER_GRADE_ABI = [
    "function getUserGrade(address user) view returns (string)", // 혹은 returns (uint256)
    // "function userGrade(address user) view returns (uint256)" // 예비용
];

export const useUserGrade = (contractAddress: string) => {
    const { account } = useWallet();
    const contract = useContract(contractAddress, USER_GRADE_ABI);

    const [grade, setGrade] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGrade = useCallback(async () => {
        if (!account || !contract) return;

        setLoading(true);
        setError(null);
        try {
            // 가상의 함수호출
            const userGrade = await contract.getUserGrade(account);
            setGrade(userGrade.toString());
        } catch (err: any) {
            console.error("Failed to fetch user grade:", err);
            // 실제 배포 전엔 에러가 날 가능성이 높으므로 기본값 처리 가능
            // setGrade("Silver"); 
            setError(err.message || "Failed to fetch user grade");
        } finally {
            setLoading(false);
        }
    }, [account, contract]);

    useEffect(() => {
        fetchGrade();
    }, [fetchGrade]);

    return {
        grade,
        loading,
        error,
        refetch: fetchGrade
    };
};
