"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import TypingText from "@/components/TypingText";
export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 overflow-hidden">

      {/* 🔥 Background Glow Blobs */}
      <div className="absolute -top-25 -left-25 w-75 h-75 bg-yellow-500/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-25 -right-25 w-75 h-75 bg-orange-500/20 rounded-full blur-[120px]" />

      {/* 🔥 Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 🔥 Main Content */}
      <div className="relative z-10">

        {/* 🔥 Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Master Coding with{" "}
          <span className="bg-linear-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-[shine_3s_linear_infinite]">
            CodeJudge
          </span>
        </motion.h1>

        {/* 🔥 Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-gray-400 max-w-xl mx-auto text-lg"
        >
          Solve problems, track your streak, and crack coding interviews 🚀
        </motion.p>

        {/* 🔥 Button */}
        <Link href="/problems">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 cursor-pointer px-8 py-3 rounded-xl font-semibold text-black bg-linear-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/40 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 cursor-pointer">Start Solving</span>

            {/* shimmer */}
            <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition blur-xl" />
          </motion.button>
        </Link>

        {/* 🔥 Stats Row (Premium touch) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex gap-8 justify-center text-sm text-gray-400"
        >
          <div>
            <p className="text-white font-bold text-lg">100+</p>
            <p>Problems</p>
          </div>
          <div>
            <p className="text-white font-bold text-lg">Fast</p>
            <p>Judge</p>
          </div>
          <div>
            <p className="text-white font-bold text-lg">Track</p>
            <p>Streak</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-lg"
        >
          <TypingText />
        </motion.div>

      </div>
    </div>
  );
}