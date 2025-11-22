import axios, { type AxiosInstance } from "axios";

const BASE = `${import.meta.env.VITE_API_BASE_URL}`;

const attachInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      // 401 Unauthorize
      if (status === 401 || status === 403) {
        window.location.href = "/auth/error";
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
