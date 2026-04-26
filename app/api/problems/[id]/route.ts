import { NextResponse } from "next/server";
import { problems } from "@/lib/data";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ IMPORTANT

  const problem = problems.find(
    (p) => String(p.id) === String(id)
  );

  if (!problem) {
    return NextResponse.json(
      { error: "Problem not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(problem);
}