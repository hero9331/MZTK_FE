import React, { createContext, useContext, useState, ReactNode } from "react";
import { BrowserProvider, type Eip1193Provider } from "ethers";
import type { EIP6963ProviderDetail } from "../global";
import { useEIP6963 } from "../hooks/useEIP6963";

interface WalletContextType {
    providers: EIP6963ProviderDetail[];
    providerDetail: EIP6963ProviderDetail | null;
    account: string | null;
    chainId: string | null;
    errorMessage: string;
    connectWallet: (selectedProviderDetail: EIP6963ProviderDetail) => Promise<void>;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const providers = useEIP6963(); // 감지된 지갑 목록 (~hooks/useEIP6963.ts)
    const [providerDetail, setProviderDetail] = useState<EIP6963ProviderDetail | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // ✅ 새로고침 시 지갑 자동 재연결 로직 (Metamask 등 window.ethereum 사용)
    React.useEffect(() => {
        const silentConnect = async () => {
            // EIP-6963 이전 호환성 (window.ethereum)
            if (window.ethereum) {
                try {
                    const provider = new BrowserProvider(window.ethereum);
                    // 이미 연결된 계정이 있는지 확인 (eth_requestAccounts 아님)
                    const accounts = await provider.send("eth_accounts", []);

                    if (accounts.length > 0) {
                        const network = await provider.getNetwork();
                        setAccount(accounts[0]);
                        setChainId(network.chainId.toString());
                        // Note: providerDetail might be null here if we didn't go through EIP-6963 selection.
                        // For now, we assume if window.ethereum works, it's usable.
                        console.log("Auto-connected to:", accounts[0]);

                        // providerDetail 없어도 account가 있으면 UI는 "연결됨"으로 표시되어야 함
                        // (혹은 window.ethereum을 감싸서 providerDetail로 설정)
                    }
                } catch (e) {
                    console.warn("Silent connect failed", e);
                }
            }
        };
        silentConnect();
    }, []);

    const connectWallet = async (selectedProviderDetail: EIP6963ProviderDetail) => {
        try {
            const provider = new BrowserProvider(selectedProviderDetail.provider as unknown as Eip1193Provider);

            const accounts = await provider.send("eth_requestAccounts", []);
            const network = await provider.getNetwork();

            setProviderDetail(selectedProviderDetail);
            setAccount(accounts[0]);
            setChainId(network.chainId.toString());
            setErrorMessage("");

            // 계정 변경 감지 등은 필요시 추가
            // (selectedProviderDetail.provider).on("accountsChanged", ...)

        } catch (error: any) {
            console.error("Failed to connect:", error);
            setErrorMessage(error.message || "Connection Failed");
        }
    };

    const disconnectWallet = () => {
        setProviderDetail(null);
        setAccount(null);
        setChainId(null);
    };

    return (
        <WalletContext.Provider
            value={{
                providers,
                providerDetail,
                account,
                chainId,
                errorMessage,
                connectWallet,
                disconnectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWalletContext must be used within a WalletProvider");
    }
    return context;
};
