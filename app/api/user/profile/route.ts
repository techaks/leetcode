import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Problem from "@/models/Problem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const revalidate = 3600; // 🔥 cache for performance

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    // ❌ not logged in
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔥 get user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 🔥 total problems count
    const totalQuestions = await Problem.countDocuments();

    // 🔥 solved count
    const solvedCount = user.solvedProblems?.length || 0;

    return NextResponse.json({
      name: user.name,
      email: user.email,

      solvedCount,
      totalQuestions,

      streak: {
        current: user.streak?.current || 0,
        longest: user.streak?.longest || 0,
      },
    });

  } catch (err) {
    console.error("Profile API Error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}