import axiosInstance from "@/lib/api/axios-instance";
import { LOGIN, LOGOUT, SIGN_UP } from "@/lib/api/config";

export const signup = async (data: {
  user_name: string;
  user_email: string;
  user_password: string;
}) => {
  try {
    const res = await axiosInstance.post(SIGN_UP, data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error; // Catch errors in service only if you transform
  }
};

export const login = async (data: {
  user_email: string;
  user_password: string;
}) => {
  try {
    const res = await axiosInstance.post(LOGIN, data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  try {
    const res = await axiosInstance.post(LOGOUT);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
