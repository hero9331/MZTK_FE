import { useState } from "react";
import { BrowserProvider, type Eip1193Provider } from "ethers";
import { useWallet } from "./useWallet";
import { requestChallenge, verifySignatureAndLogin } from "../services/auth";

export const useAuth = () => {
    const { account, providerDetail } = useWallet();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const login = async () => {
        // providerDetail might be null if auto-connected, but window.ethereum should be available
        if (!account || (!providerDetail && !window.ethereum)) {
            setError("Wallet not connected");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Request Challenge
            const challengeResponse = await requestChallenge(account);
            // Backend returns { message: "..." } but we might expect { challenge: "..." }
            const challenge = challengeResponse.message || challengeResponse.challenge;

            if (!challenge) {
                console.error("Invalid Challenge Response:", challengeResponse);
                throw new Error("Failed to receive challenge from server");
            }

            console.log("Signing Challenge:", challenge);

            // 2. Sign Challenge (EIP-712)
            let provider;
            if (providerDetail) {
                provider = new BrowserProvider(providerDetail.provider as unknown as Eip1193Provider);
            } else {
                provider = new BrowserProvider(window.ethereum);
            }

            const signer = await provider.getSigner();

            // Backend Config derived from response
            // challengeResponse now contains: { message, verifyingContract, chainId }
            console.log("🔍 Challenge Response:", challengeResponse);

            const domain = {
                name: "VoucherLogin",
                version: "1",
                chainId: challengeResponse.chainId || 11155111,
                verifyingContract: challengeResponse.verifyingContract || import.meta.env.VITE_VOUCHER_ADDRESS || "0xC723df7a1ab01eD124806de767Ba695847F9d724"
            };
            console.log("📝 EIP-712 Domain:", domain);

            const types = {
                Login: [
                    { name: "message", type: "string" }
                ]
            };

            const value = {
                message: challenge
            };

            const signature = await signer.signTypedData(domain, types, value);


            // 3. Verify & Get Token
            const response = await verifySignatureAndLogin(account, signature);
            const jwt = response.token; // Assuming response structure { token: "..." }

            // Store token (e.g., in localStorage or context)
            localStorage.setItem("authToken", jwt);
            setToken(jwt);
            setIsAuthenticated(true);

        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.message || "Login failed");
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        token,
        loading,
        error,
        login,
        logout
    };
};
