"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Login = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onsubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const formdata = new FormData(e.currentTarget);
    const user = Object.fromEntries(formdata.entries());

    try {
      const { data, error } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
      });

      console.log({ data, error });

      if (error) {
        setError(error.message || "Invalid email or password.");
        return;
      }

      if (data) {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      console.log({ data, error });

      if (error) {
        setError(error.message || "Google login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong with Google login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] px-4 py-10">
      <div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

          {/* Left Side */}
          <div className="hidden bg-[#22333b] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">
                  LegalEase
                </h1>

                <p className="mt-2 text-sm text-[#eae0d5]">
                  Your trusted legal connection platform.
                </p>
              </div>

              <h2 className="max-w-md text-4xl font-semibold leading-tight">
                Welcome back,
                <span className="text-[#c6ac8f]">
                  {" "}let's get started.
                </span>
              </h2>

              <p className="mt-6 max-w-md leading-7 text-gray-300">
                Access your LegalEase account and connect with qualified
                lawyers for your legal needs.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-6 text-gray-300">
                "LegalEase makes finding the right legal professional simple,
                transparent, and accessible."
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#7d7236]">
                Welcome Back
              </p>

              <h2 className="text-3xl font-bold text-[#22333b]">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter your details to continue to LegalEase.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={onsubmit}>
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-[#7d7236] focus:bg-white focus:ring-2 focus:ring-[#7d7236]/10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#7d7236] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-[#7d7236] focus:bg-white focus:ring-2 focus:ring-[#7d7236]/10"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#22333b] py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#18272d] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-medium text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="text-lg font-bold">G</span>
              Continue with Google
            </button>

            {/* Register */}
            <p className="mt-7 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/auth/Register"
                className="font-semibold text-[#7d7236] hover:underline"
              >
                Create an account
              </Link>
            </p>

            {/* Terms */}
            <p className="mt-5 text-center text-xs leading-5 text-gray-400">
              By continuing, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;