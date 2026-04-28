import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, wrapper, input, language } = await req.json();

    // 🔥 inject user code
    const finalCode = wrapper.replace("// USER_CODE_HERE", code);

    // 🔥 convert input object → stdin string
    let stdin = "";

    if (input && typeof input === "object") {
      stdin = Object.values(input)
        .map((val) => {
          if (Array.isArray(val)) {
            return val.join(" ");
          }
          return val;
        })
        .join(" ");
    }

    // 🔥 language mapping
    let lang = "cpp17";
    if (language === "python") lang = "python3";

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: finalCode,
        stdin, // 🔥 MAIN CHANGE
        language: lang,
        versionIndex: "0",
      }),
    });

    const data = await response.json();

    console.log("JDoodle Response:", data);

    // 🔥 normalize response
    return NextResponse.json({
      output: data.output || "",
      error: data.error || "",
      stderr: data.stderr || "",
      compile_output: data.compile_output || "",
      isExecutionSuccess: data.isExecutionSuccess,
    });

  } catch (error) {
    console.error("Run API Error:", error);

    return NextResponse.json(
      { error: "Execution failed" },
      { status: 500 }
    );
  }
}