import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();

 const post = await Post.findById(postId);
const email = session.user.email;

// 🔥 ensure array
if (!post.likes) post.likes = [];

// 🔥 toggle correctly
if (post.likes.includes(email)) {
  post.likes = post.likes.filter((e: string) => e !== email);
} else {
  post.likes.push(email);
}

// 🔥 remove duplicates (extra safety)
post.likes = [...new Set(post.likes)];

await post.save();

return NextResponse.json({
  likesCount: post.likes.length,
  liked: post.likes.includes(email),
});
}