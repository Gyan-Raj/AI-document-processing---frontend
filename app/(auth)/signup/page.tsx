"use client";
import { signup } from "@/services/auth.service";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
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
          <label htmlFor="userName">Name</label>
          <input
            type="text"
            name="userName"
            id="userName"
            className="focus:outline-0 border border-gray-400 w-full sm:w-[80%] lg:w-[60%] px-2 py-1"
            value={userDetails.userName}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="userEmail">Username/Email</label>
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
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="userPassword">Password</label>
          <input
            type="password"
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
          className="bg-gray-900 cursor-pointer text-white py-2"
          disabled={isSubmitting}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
