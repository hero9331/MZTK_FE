import axios, { type AxiosInstance } from "axios";

// .env 설정이 꼬일 수 있으므로, 로컬 개발용 주소를 강제로 지정합니다.
const BASE = "http://localhost:8080/api";
console.log("API Base URL:", BASE);

const attachInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    console.log(`📡 Sending Request: ${config.baseURL}${config.url}`);

    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("🚨 API Error:", error.response?.status, error.config?.url);
      console.error("🔍 Error Details:", error.response?.data);
      const status = error.response?.status;


      // 401 Unauthorize - 잠시 리다이렉트 끔 (디버깅용)
      if (status === 401 || status === 403) {
        // window.location.href = "/auth/error";
        console.warn("401/403 Error detected, but redirect disabled for debugging.");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = attachInterceptors(
  axios.create({
    baseURL: BASE,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  })
);

export const authApi = attachInterceptors(
  axios.create({
    baseURL: `${BASE}/auth`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  })
);
