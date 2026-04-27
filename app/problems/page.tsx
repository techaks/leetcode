"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/problems")
      .then((res) => res.json())
      .then((data) => setProblems(data));
  }, []);

  console.log(problems);

  // 🔥 FIXED FILTER
  const filtered = problems.filter((p, index) => {
    const query = search.trim().toLowerCase();

    if (query === "") return true;

    // number search (index based)
    if (!isNaN(Number(query))) {
      return index + 1 === Number(query);
    }

    return p.title?.toLowerCase().includes(query);
  });

  // 🔥 solved (future ready)
  const solvedCount = problems.filter((p) => p.solved).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        
        {/* Topics (static for now) */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["All Topics", "Array", "String", "DP", "Graph"].map((t, i) => (
            <button
              key={i}
              className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-yellow-400/10 hover:text-yellow-400 transition whitespace-nowrap"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Solved Count */}
        <div className="text-sm text-gray-400">
          {solvedCount}/{problems.length} Solved
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-yellow-400"
        />
      </div>

      {/* Header */}
      <div className="grid grid-cols-12 px-4 py-2 text-gray-400 text-sm border-b border-white/10">
        <div className="col-span-1">#</div>
        <div className="col-span-7">Title</div>
        <div className="col-span-4 text-right">Difficulty</div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 mt-2">
        {filtered.map((p, index) => (
          <motion.div
           key={p._id ? p._id.toString() : index}
            whileHover={{ scale: 1.01 }}
            onClick={() => router.push(`/problems/${p._id}`)} // 🔥 FIX
            className="cursor-pointer grid grid-cols-12 items-center px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-400/30 transition"
          >
            {/* Number + Tick */}
            <div className="col-span-1 flex items-center gap-2">
              {p.solved ? (
                <span className="text-green-400 text-sm">✔</span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-600 inline-block"></span>
              )}
              <span>{index + 1}</span> {/* 🔥 FIX */}
            </div>

            {/* Title */}
            <div className="col-span-7 text-gray-200">
              {p.title}
            </div>

            {/* Difficulty */}
            <div className="col-span-4 text-right">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  p.difficulty === "Easy"
                    ? "bg-green-500/10 text-green-400"
                    : p.difficulty === "Medium"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {p.difficulty}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No problems found 😕
        </div>
      )}
    </div>
  );
}