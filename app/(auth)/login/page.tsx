"use client";
import axiosInstance from "@/lib/api/axios-instance";
import { login } from "@/services/auth.service";
import { useUserDetails } from "@/store/auth.store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState({
    userEmail: "",
    userPassword: "",
  });
  const router = useRouter();
  const { setUserInfo } = useUserDetails();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login(userDetails);
      // ✅ After login, verify and populate store
      const res = await axiosInstance.get("/get-me");
      setUserInfo(res.data.data);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.detail || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h3>
        Doesn't have an account?{" "}
        <Link href="/signup" className="underline text-blue-400">
          Sign Up
        </Link>
      </h3>
      <form
        className="w-[60%] border border-gray-400 flex flex-col justify-center gap-6 p-4"
        onSubmit={handleLogin}
      >
        {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
        {/* ✅ show errors */}
        <div className="flex flex-col gap-2">
          <label htmlFor="userEmail">Email</label>
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            className="focus:outline-0 border border-gray-400 w-full sm:w-[80%] lg:w-[60%] px-2 py-1"
            value={userDetails.userEmail}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="userPassword">Password</label>
          <input
            type="password" // ✅ fixed from "text"
            name="userPassword"
            id="userPassword"
            className="focus:outline-0 border border-gray-400 w-full sm:w-[80%] lg:w-[60%] px-2 py-1"
            value={userDetails.userPassword}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className="bg-gray-900 cursor-pointer text-white py-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
