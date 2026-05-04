"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserDetails } from "@/store/auth.store";
import axiosInstance from "@/lib/api/axios-instance";
import { logout } from "@/services/auth.service";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userInfo, setUserInfo, clearUser } = useUserDetails();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axiosInstance.get("/get-me");
        // /get-me succeeded (interceptor handled token refresh if needed)
        setUserInfo(res.data.data);
        setAllowed(true);
      } catch {
        // /get-me failed even after refresh attempt → logged out
        clearUser();
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    check();
  }, []);

  if (checking) return <div>Loading...</div>;
  if (!allowed) return null;
  const handleLogout = async () => {
    try {
      await logout();
      clearUser(); // ✅ clear store
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      clearUser(); // ✅ clear store even if API fails
      router.replace("/login");
    }
  };
  return (
    <div className="h-screen">
      <header className="flex items-center justify-between py-2 px-4 border border-b-gray-400">
        <button
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer bg-gray-200 px-4 py-2 rounded-full"
        >
          Home
        </button>
        <h3>Hi, {userInfo?.userName}</h3>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Logout
        </button>
      </header>

      <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
