import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { problemId } = await req.json();

  const user = await User.findOne({ email: session.user.email });

  // 🔥 already solved check
const alreadySolved = user.solvedProblems.some(
  (p: any) => p.problemId.toString() === problemId
);

if (!alreadySolved) {
  user.solvedProblems.push({
    problemId,
    solvedAt: new Date(),
  });

    // 🔥 streak logic
    const today = new Date().toISOString().slice(0, 10);

    if (!user.lastSolvedDate) {
      user.streak.current = 1;
    } else {
      const last = new Date(user.lastSolvedDate);
      const diff =
        (new Date(today).getTime() - last.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) {
        user.streak.current += 1;
      } else if (diff > 1) {
        user.streak.current = 1;
      }
    }

    user.lastSolvedDate = today;

    // longest streak update
    user.streak.longest = Math.max(
      user.streak.longest || 0,
      user.streak.current
    );

    await user.save();
  }

  return NextResponse.json({ success: true });
}