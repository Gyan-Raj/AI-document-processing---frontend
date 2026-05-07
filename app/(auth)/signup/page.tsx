"use client";
import { ButtonWithSpinner } from "@/app/components/ButtonWithSpinner";
import { signup } from "@/services/auth.service";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
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
    if (
      !userDetails.user_email ||
      !userDetails.user_name ||
      !userDetails.user_password
    ) {
      setError("Please fill name, email and password");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      await signup(userDetails);
    } catch (err: any) {
      setError(err?.detail || "Something went wrong, please try again.");
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
        {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
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
        <ButtonWithSpinner
          text="Sign up"
          loadingText="Signing up..."
          isLoading={isSubmitting}
          type="submit"
        />
      </form>
    </div>
  );
}
