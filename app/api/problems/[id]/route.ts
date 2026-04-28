import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Problem from "@/models/Problem";

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

    return NextResponse.json(problem);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid ID" },
      { status: 400 }
    );
  }
}