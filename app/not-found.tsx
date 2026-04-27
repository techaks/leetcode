"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0b0b0b] text-white px-4 text-center">

      {/* Big 404 */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
     
        animate={{ y: [0, -10, 0] }}
transition={{ repeat: Infinity, duration: 2 }}
        className="text-7xl md:text-9xl font-bold text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
      >
        404
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-gray-400 text-lg max-w-md"
      >
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/">
          <button className="mt-6 px-6 py-3 bg-yellow-500 text-black rounded-xl font-medium hover:bg-yellow-400 transition shadow-lg hover:shadow-yellow-400/30">
            Go Home
          </button>
        </Link>
      </motion.div>

      {/* Background Glow */}
      <div className="absolute w-75 h-75 bg-yellow-500/20 blur-[120px] rounded-full -z-10"></div>

    </div>
  );
}