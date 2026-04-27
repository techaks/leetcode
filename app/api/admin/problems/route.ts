import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Problem from "@/models/Problem";

export async function GET() {
  await connectDB();

  const problems = await Problem.find().sort({ createdAt: -1 });

  return NextResponse.json(problems);
}