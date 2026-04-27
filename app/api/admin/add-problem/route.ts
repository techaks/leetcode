import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Problem from "@/models/Problem";

export async function POST(req: Request) {
  await connectDB();

  try {
    const data = await req.json();
    console.log("DATA RECEIVED:", data);

    // 🔥 VALIDATION
    if (!data.title || !data.description || !data.constraints) {
      return NextResponse.json(
        { error: "Missing basic fields" },
        { status: 400 }
      );
    }

    if (!data.functionName) {
      return NextResponse.json(
        { error: "functionName required" },
        { status: 400 }
      );
    }

    if (!data.templates?.cpp || !data.templates?.python) {
      return NextResponse.json(
        { error: "Templates required" },
        { status: 400 }
      );
    }

    if (!data.wrappers?.cpp || !data.wrappers?.python) {
      return NextResponse.json(
        { error: "Wrappers required" },
        { status: 400 }
      );
    }

    if (!data.publicTestCases?.length || !data.privateTestCases?.length) {
      return NextResponse.json(
        { error: "Test cases required" },
        { status: 400 }
      );
    }

    // 🔥 SAVE
    const problem = await Problem.create(data);
   console.log("SAVED:", problem);
    
    return NextResponse.json(problem);
  } catch (err) {
    console.error("❌ ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}