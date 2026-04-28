"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 wait for session
    if (status === "loading") return;

    // 🔥 not logged in → redirect
    if (!session) {
      router.replace("/login");
      return;
    }

    // 🔥 fetch profile
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.error) {
          router.replace("/login");
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.log("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status, router]);

  // 🔥 session loading
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  // 🔥 safety fallback
  if (!profile) {
    return null;
  }

  const totalSolved = profile.solvedCount || 0;
  const totalQuestions = profile.totalQuestions ?? 0;

  const percent =
    totalQuestions === 0 ? 0 : (totalSolved / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* 🔥 USER INFO */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h1 className="text-2xl font-bold text-yellow-400">
            {session?.user?.name || "User"}
          </h1>
          <p className="text-gray-400">{session?.user?.email}</p>
        </div>

        {/* 🔥 SOLVED CHART */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg flex flex-col items-center">

          <div className="relative w-40 h-40">

            <svg className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#333" strokeWidth="10" fill="none" />

              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#facc15"
                strokeWidth="10"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * percent) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* CENTER TEXT */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-bold">
                {totalSolved}/{totalQuestions}
              </span>
              <span className="text-sm text-gray-400">Solved</span>
            </div>
          </div>

          <p className="mt-4 text-gray-400">
            Keep solving problems 🚀
          </p>
        </div>

        {/* 🔥 STREAK */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-3 text-yellow-400">
            🔥 Streak
          </h2>

          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Current</p>
              <p className="text-xl font-bold">
                {profile.streak?.current || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Longest</p>
              <p className="text-xl font-bold">
                {profile.streak?.longest || 0}
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Home
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}