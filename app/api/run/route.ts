import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  try {
    const res = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: code,
        language: "cpp17", // C++17
        versionIndex: "0",
        stdin: "",
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}