"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      alert("Signup successful 🎉");
      router.push("/login");
    } else {
      alert("Signup failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg">

        {/* Title */}
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Create Account 🚀
        </h2>

        {/* Name */}
        <input
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:outline-none focus:border-yellow-400"
        />

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
          onClick={signup}
          className="w-full bg-green-500 hover:bg-green-400 transition py-2 rounded-lg font-medium text-white"
        >
          Signup
        </button>

        {/* Divider */}
        <div className="my-5 border-t border-white/10"></div>

        {/* Switch to Login */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}