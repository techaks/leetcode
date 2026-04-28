import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Problem from "@/models/Problem";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  let solvedSet = new Set<string>();

  // 🔥 user solved problems
  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email });

    if (user?.solvedProblems) {
      solvedSet = new Set(
        user.solvedProblems.map((p: any) =>
          p.problemId?.toString()
        )
      );
    }
  }

  // 🔥 get all problems
  const problems = await Problem.find().sort({ createdAt: 1 });

  console.log("API HIT");
  // 🔥 map with solved flag
  const formatted = problems.map((p, i) => ({
    _id: p._id,
    title: p.title,
    difficulty: p.difficulty,
    solved: solvedSet.has(p._id.toString()), // ✅ FIX
  }));

  return NextResponse.json(formatted);
}