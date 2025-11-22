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
