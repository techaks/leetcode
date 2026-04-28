import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 🔥 GET
export async function GET() {
  await connectDB();

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(50);

  // ✅ likes fix यहाँ होना चाहिए
  return NextResponse.json(
    posts.map((p) => ({
      ...p._doc,
      likes: p.likes || [],
    }))
  );
}

// 🔥 POST
export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();

  if (!content || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Content required" },
      { status: 400 }
    );
  }

  const post = await Post.create({
    authorName: session.user.name || "User",
    authorEmail: session.user.email,
    content: content.trim(),
  });

  // ✅ सिर्फ post return करो
  return NextResponse.json({
    ...post._doc,
    likes: post.likes || [],
  });
}