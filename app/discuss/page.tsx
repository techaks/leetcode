"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function DiscussPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  // 🔥 fetch posts
  const fetchPosts = async () => {
    const res = await fetch("/api/discuss");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔥 submit post
  const submitPost = async () => {
    if (!content.trim()) {
      toast.error("Write something first ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/discuss", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed ❌");
      } else {
        toast.success("Posted 🚀");
        setContent("");
        fetchPosts();
      }
    } catch {
      toast.error("Error ⚠️");
    }

    setLoading(false);
  };

  // 🔥 LIKE FUNCTION
  const toggleLike = async (postId: string) => {
    if (!session) {
      toast.error("Login required ❌");
      return;
    }

    try {
      const res = await fetch("/api/discuss/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

     setPosts((prev) =>
  prev.map((p) => {
    if (p._id !== postId) return p;

    const alreadyLiked = p.likes?.includes(session?.user?.email);

    return {
      ...p,
      likes: alreadyLiked
        ? p.likes.filter((e: string) => e !== session?.user?.email)
        : [...(p.likes || []), session?.user?.email],
    };
  })
);
    } catch {
      toast.error("Error liking ⚠️");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">

      {/* 🔥 Create Post */}
      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something..."
          className="w-full p-3 rounded-lg bg-black border border-white/10 focus:outline-none focus:border-yellow-400"
        />

        <button
          onClick={submitPost}
          disabled={loading}
          className="mt-3 px-5 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* 🔥 Posts */}
      <div className="space-y-4">
        {posts.map((p) => {
          const liked = p.likes?.includes(session?.user?.email);

          return (
            <div
              key={p._id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              {/* Header */}
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span className="text-yellow-400 font-medium">
                  {p.authorName}
                </span>
                <span>
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Content */}
              <p className="text-gray-200 whitespace-pre-wrap">
                {p.content}
              </p>

              {/* 🔥 LIKE BUTTON */}
              <div className="flex items-center gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 1.4 }}
                  onClick={() => toggleLike(p._id)}
                  className={`flex items-center gap-1 text-sm transition ${
                    liked
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-400"
                  }`}
                >
                  <Heart
                    size={16}
                    className={`transition ${
                      liked ? "fill-red-500 scale-110" : ""
                    }`}
                  />
                  {p.likes?.length || 0}
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty */}
      {posts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No posts yet 😕
        </p>
      )}
    </div>
  );
}