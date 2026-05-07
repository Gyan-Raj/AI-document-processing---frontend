"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserDetails } from "@/store/auth.store";
import axiosInstance from "@/lib/api/axios-instance";
import { FullScreenLoader } from "@/app/components/ui/FullSCreenLoader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUserInfo, clearUser } = useUserDetails();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axiosInstance.get("/get-me");
        // Already logged in → go to dashboard
        setUserInfo(res.data.data);
        router.replace("/dashboard");
      } catch {
        // Not logged in → show login/signup
        clearUser();
        setAllowed(true);
      } finally {
        setChecking(false);
      }
    };

    check();
  }, []);

  if (checking) return <FullScreenLoader />;
  if (!allowed) return null;

  return <>{children}</>;
}
