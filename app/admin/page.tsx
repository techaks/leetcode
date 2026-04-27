"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AddProblemForm from "./AddProblemForm";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) setLoggedIn(true);
    else alert("Wrong password");
  };



  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-[#0d0d0d] to-[#111] text-white px-4">

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
        >

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2">
            Admin Panel
          </h1>

          <p className="text-sm text-gray-400 text-center mb-6">
            Secure access for managing coding problems, test cases and templates.
          </p>

          {/* Input */}
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-yellow-400 transition"
            />

            {/* Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={login}
              className="py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
            >
              Login
            </motion.button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Only authorized admins can add or modify problems.
          </p>
        </motion.div>
      </div>
    );
  }

  return <AddProblemForm />;
}