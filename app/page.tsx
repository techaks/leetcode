"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold"
      >
        Master Coding with{" "}
        <span className="text-yellow-400">CodeJudge</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-gray-400 max-w-xl"
      >
        Solve problems, track progress, and crack coding interviews 🚀
      </motion.p>

 
<Link href="/problems">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}   // 🔥 click animation
    className=" cursor-pointer mt-6 px-6 py-3 bg-yellow-500 text-black rounded-xl font-medium hover:bg-yellow-400 transition shadow-md hover:shadow-yellow-400/30"
  >
    Start Solving
  </motion.button>
</Link>

    </div>
  );
}