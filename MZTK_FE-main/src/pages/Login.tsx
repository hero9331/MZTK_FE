import React, { useEffect } from "react";
import { useWallet, useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // Custom Hooks
  const { providers, providerDetail, connectWallet, account } = useWallet();
  const { login, isAuthenticated, loading, error, token } = useAuth(); // useAuth updated to accept account inside? No, useAuth uses useWallet internally or we pass it.

  // Existing OAuth Logic
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const KAKAO_REDIRECT_URI = "http://localhost:8080/auth/login/kakao";
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = "http://localhost:8080/auth/login/google";

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;

  const handleKakaoLogin = () => window.location.href = KAKAO_AUTH_URL;
  const handleGoogleLogin = () => window.location.href = GOOGLE_AUTH_URL;

  // Wallet Login Logic
  const handleWalletLogin = async () => {
    await login();
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/exchange"); // Login successful -> go to Exchange
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="mb-6 text-2xl font-bold text-center">로그인</h1>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-4 mb-8">
          <button onClick={handleKakaoLogin} className="px-6 py-3 font-bold text-black bg-[#FEE500] rounded-lg hover:bg-[#E6CF00] transition-colors">
            카카오로 로그인하기
          </button>
          <button onClick={handleGoogleLogin} className="px-6 py-3 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
            구글로 로그인하기
          </button>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-center mb-4">지갑 연결 로그인 (Web3)</h2>

          {/* 1. 지갑 선택 및 연결 */}
          {!account ? (
            <div className="flex flex-col gap-2">
              {providers.length > 0 ? (
                providers.map((p) => (
                  <button
                    key={p.info.uuid}
                    onClick={() => connectWallet(p)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border rounded hover:bg-gray-50 bg-white"
                  >
                    <img src={p.info.icon} alt={p.info.name} className="w-5 h-5" />
                    <span>{p.info.name} 연결</span>
                  </button>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500">
                  감지된 지갑이 없습니다. <br />(MetaMask 등을 설치해주세요)
                </div>
              )}
            </div>
          ) : (
            /* 2. 연결됨 -> 서명 로그인 요청 */
            <div className="flex flex-col gap-3">
              <div className="text-sm bg-gray-50 p-2 rounded break-all">
                <span className="font-bold">연결됨:</span> {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </div>

              <button
                onClick={handleWalletLogin}
                disabled={loading}
                className="w-full px-6 py-3 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? "서명 확인 중..." : "지갑으로 로그인 (서명)"}
              </button>
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;