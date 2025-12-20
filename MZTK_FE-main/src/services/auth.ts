import { authApi } from "./client";

// GET: Kakao Login
export const GetKakaoLogin = async () => {
  const { data } = await authApi.get("/login/kakao/url");

  return data;
};

// GET: Google Login
export const GetGoogleLogin = async () => {
  const { data } = await authApi.get("/login/google/url");

  return data;
};

// POST: Request Challenge
export const requestChallenge = async (address: string) => {
  const { data } = await authApi.post("/wallet/challenge", { address });
  return data; // { challenge: "..." }
};

// POST: Verify & Login
export const verifySignatureAndLogin = async (address: string, signature: string) => {
  const { data } = await authApi.post("/wallet/login", { address, signature });
  return data; // { token: "...", ... }
};
