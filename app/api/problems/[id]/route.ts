import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Problem from "@/models/Problem";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  try {
    const problem = await Problem.findById(id);

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    // 🔥 session
    const session = await getServerSession(authOptions);

    let solved = false;

    // 🔥 check user solved
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });

      if (user?.solvedProblems) {
        solved = user.solvedProblems.some(
          (p: any) => p.problemId.toString() === id
        );
      }
    }

    // 🔥 FINAL RESPONSE (IMPORTANT)
    return NextResponse.json({
      ...problem.toObject(), // ⚠️ use this instead of _doc
      solved,
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Invalid ID" },
      { status: 400 }
    );
  }
}