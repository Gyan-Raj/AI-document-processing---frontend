"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserDetails } from "@/store/auth.store";
import axiosInstance from "@/lib/api/axios-instance";
import { logout } from "@/services/auth.service";
import { ButtonWithSpinner } from "@/app/components/ButtonWithSpinner";
import { FullScreenLoader } from "@/app/components/ui/FullSCreenLoader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userInfo, setUserInfo, clearUser } = useUserDetails();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  if (checking) return <FullScreenLoader />;
  if (!allowed) return null;
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      clearUser(); // ✅ clear store
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      clearUser(); // ✅ clear store even if API fails
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <div className="h-screen">
      <header className="flex items-center justify-between py-2 px-4 border border-b-gray-400">
        <ButtonWithSpinner
          text="Home"
          onClick={() => router.push("/dashboard")}
        />
        <h3>Hi, {userInfo?.user_name}</h3>

        <ButtonWithSpinner
          text="Logout"
          loadingText="Logging out..."
          onClick={handleLogout}
          variant="danger"
          isLoading={isLoggingOut}
        />
      </header>

      <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
