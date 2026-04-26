import { NextResponse } from "next/server";
import { problems } from "@/lib/data";

export async function GET() {
  return NextResponse.json(problems);
}