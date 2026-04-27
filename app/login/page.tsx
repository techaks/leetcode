"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/problems",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg">

        {/* Title */}
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:outline-none focus:border-yellow-400"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-5 px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:outline-none focus:border-yellow-400"
        />

        {/* Button */}
        <button
          onClick={login}
          className="w-full bg-yellow-400 hover:bg-yellow-300 transition py-2 rounded-lg font-medium text-black"
        >
          Login
        </button>

        {/* Divider */}
        <div className="my-5 border-t border-white/10"></div>

        {/* Switch to Signup */}
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}