"use client";
import { signup } from "@/services/auth.service";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await signup(userDetails);
      // 👉 redirect or show success
    } catch (error: any) {
      console.error("Signup failed:", error);
      // 👉 show error to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h3>
        Have an account?{" "}
        <Link href="/login" className="underline text-blue-400">
          Log in
        </Link>
      </h3>
      <form
        className="w-[60%] border border-gray-400 flex flex-col justify-center gap-6 p-4"
        onSubmit={handleSignUp}
      >
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="user_name">Name</label>
          <input
            type="text"
            name="user_name"
            id="user_name"
            className="focus:outline-0 border border-gray-400 w-full sm:w-[80%] lg:w-[60%] px-2 py-1"
            value={userDetails.user_name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="user_email">User name/Email</label>
          <input
            type="email"
            name="user_email"
            id="user_email"
            className="focus:outline-0 border border-gray-400 w-full sm:w-[80%] lg:w-[60%] px-2 py-1"
            value={userDetails.user_email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="user_password">Password</label>
          <input
            type="password"
            name="user_password"
            id="user_password"
            className="focus:outline-0 border border-gray-400 w-full sm:w-[80%] lg:w-[60%] px-2 py-1"
            value={userDetails.user_password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className="bg-gray-900 cursor-pointer text-white py-2"
          disabled={isSubmitting}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
