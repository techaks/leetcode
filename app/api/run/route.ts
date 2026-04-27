import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: code,
        language: "cpp17",
        versionIndex: "0",
      }),
    });

    const data = await response.json();

    // 🔥 IMPORTANT LOG
    console.log("JDoodle Response:", data);

    return NextResponse.json({
      output: data.output || "",
      stderr: data.stderr || "",
      compile_output: data.compile_output || "",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Execution failed" },
      { status: 500 }
    );
  }
}