"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function ProblemDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
const [isSolved, setIsSolved] = useState(false);
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState("// write code here");
  const [editorHeight, setEditorHeight] = useState(65);
  const isDragging = useRef(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("cpp");

  // 🔥 fetch problem
useEffect(() => {
  if (!id) return;

  fetch(`/api/problems/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setProblem(data);
      setIsSolved(data.solved || false);  
    });
}, [id]);

  // 🔥 AUTH GUARD
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      toast.error("Login required 🔒");
      router.replace("/login");
    }
  }, [session, status, router]);

  // 🔥 resize logic
  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const newHeight = (e.clientY / window.innerHeight) * 100;

    if (newHeight > 25 && newHeight < 80) {
      setEditorHeight(newHeight);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // 🔥 language template load
  useEffect(() => {
    if (!problem) return;

    let newCode = "";

    if (lang === "cpp") newCode = problem.templates?.cpp || "";
    else if (lang === "python") newCode = problem.templates?.python || "";
    else if (lang === "javascript")
      newCode = problem.templates?.javascript || "// JS code here";
    else if (lang === "c")
      newCode = problem.templates?.c || "// C code here";

    setCode(newCode);
  }, [lang, problem]);

  // 🔥 RUN CODE
  const runCode = async () => {
    if (!problem) return;

    setLoading(true);
    toast.loading("Running...", { id: "run" });

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          wrapper:
            lang === "cpp"
              ? problem.wrappers.cpp
              : problem.wrappers.python,
          input: problem.publicTestCases[0].input,
          language: lang,
        }),
      });

      const data = await res.json();
      const output = (data.output || "").trim();

      if (!data.isExecutionSuccess) {
        toast.error("❌ Execution Failed", { id: "run" });
        setResult(output || "Execution failed");
      } else {
        toast.success("✅ Run Successful", { id: "run" });
        setResult(output);
      }
    } catch {
      toast.error("⚠️ Run Failed", { id: "run" });
      setResult("Server Error");
    }

    setLoading(false);
  };

  // 🔥 SUBMIT CODE
  const submitCode = async () => {
    if (!problem) return;

    setLoading(true);
    toast.loading("Submitting...", { id: "submit" });

    try {
      const allTests = [
        ...problem.publicTestCases,
        ...problem.privateTestCases,
      ];

      for (let i = 0; i < allTests.length; i++) {
        const tc = allTests[i];

        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            wrapper:
              lang === "cpp"
                ? problem.wrappers.cpp
                : problem.wrappers.python,
            input: tc.input,
            language: lang,
          }),
        });

        const data = await res.json();

        if (!data.isExecutionSuccess) {
          toast.error(`❌ Error at Test ${i + 1}`, { id: "submit" });
          setResult(`❌ Error\n\nTest ${i + 1}\n${data.output}`);
          setLoading(false);
          return;
        }

        const output = (data.output || "").trim();
        const expected = (tc.output || "").trim();

        if (output !== expected) {
          toast.error(`❌ Failed at Test ${i + 1}`, { id: "submit" });
          setResult(`❌ Failed

Test ${i + 1}: ✖ Failed
Expected: ${expected}
Got: ${output}`);
          setLoading(false);
          return;
        }
      }

      toast.success("🎉 Accepted!", { id: "submit" });
setIsSolved(true);
      setResult(`🎉 Accepted

${allTests
  .map((_: any, i: number) => `Test ${i + 1}: ✔ Passed`)
  .join("\n")}`);

      await fetch("/api/user/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem._id }),
      });
    } catch {
      toast.error("⚠️ Submit Failed", { id: "submit" });
    }

    setLoading(false);
  };

  // 🔥 AUTH UI GUARD
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Checking auth...
      </div>
    );
  }

  if (!session) return null;

  if (!problem) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex h-[90vh]">
      {/* LEFT */}
     <div className="w-1/2 p-6 overflow-y-auto border-r border-white/10 bg-[#0d0d0d]">

  {/* Title */}
  <h1 className="text-xl font-semibold mb-2 text-yellow-400">
    {problem?.title}
  </h1>
  {isSolved && (
    <span className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-400 border border-green-400/20">
      ✔ Solved
    </span>
  )}

  {/* Difficulty */}
  <span
    className={`px-2 py-1 text-xs rounded font-medium ${
      problem.difficulty === "Easy"
        ? "text-green-400"
        : problem.difficulty === "Medium"
        ? "text-yellow-400"
        : "text-red-400"
    }`}
  >
    {problem.difficulty}
  </span>

  {/* Description */}
  <p className="mt-4 text-gray-300 whitespace-pre-line">
    {problem?.description}
  </p>

  {/* 🔥 Examples */}
  <div className="mt-6">
    <h2 className="text-sm font-semibold text-gray-400 mb-2">
      Examples
    </h2>

    {problem.examples?.map((ex: any, i: number) => (
      <div
        key={i}
        className="mb-4 bg-white/5 p-3 rounded-lg border border-white/10"
      >
        <div className="text-xs text-gray-400 mb-1">Input</div>
        <pre className="text-sm text-gray-200">{ex.input}</pre>

        <div className="text-xs text-gray-400 mt-2 mb-1">Output</div>
        <pre className="text-sm text-gray-200">{ex.output}</pre>
      </div>
    ))}
  </div>

  {/* 🔥 Constraints */}
  <div className="mt-6">
    <h2 className="text-sm font-semibold text-gray-400 mb-2">
      Constraints
    </h2>
    <p className="text-gray-300 whitespace-pre-line">
      {problem.constraints}
    </p>
  </div>

</div>

      {/* RIGHT */}
      <div className="w-1/2 flex flex-col bg-[#0b0b0b]">
        {/* Editor */}
        <div style={{ height: `${editorHeight}%` }}>
          <Editor
            height="100%"
            language={lang === "cpp" ? "cpp" : lang}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between px-4 py-2 border-t border-white/10">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-black border text-white px-2 py-1"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="javascript">JS</option>
            <option value="python">Python</option>
          </select>

          <div className="flex gap-2">
            <button onClick={runCode} className="bg-blue-500 px-3 py-1 rounded">
              Run
            </button>
            <button onClick={submitCode} className="bg-green-500 px-3 py-1 rounded">
              Submit
            </button>
          </div>
        </div>

        {/* Drag */}
        <div
          onMouseDown={handleMouseDown}
          className="h-2 cursor-row-resize bg-white/10"
        />

        {/* Result */}
        <div className="p-4 flex-1 overflow-y-auto bg-black">
          <pre>{result || "Run your code..."}</pre>
        </div>
      </div>
    </div>
  );
}