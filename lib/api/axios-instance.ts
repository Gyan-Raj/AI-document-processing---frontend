// lib/api/axios-instance.ts
import axios from "axios";
import { _signout } from "../../app/(auth)/auth-helpers";

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// ✅ Separate instance for refresh — completely bypasses the interceptor
const refreshInstance = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false; // ✅ prevents parallel refresh calls

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // ✅ Don't intercept the refresh call itself
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        _signout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // ✅ If already refreshing, just reject — don't queue another refresh
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshInstance.get("/auth/refresh-token"); // ✅ uses separate instance
        isRefreshing = false;
        return axiosInstance(originalRequest); // retry original
      } catch (refreshError) {
        isRefreshing = false;
        _signout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
