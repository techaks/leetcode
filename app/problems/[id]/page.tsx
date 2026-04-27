"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);

  const [code, setCode] = useState("// write code here");
  const [editorHeight, setEditorHeight] = useState(65);

  const isDragging = useRef(false);
  const [cooldown, setCooldown] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("cpp");

  // 🔥 language map
  const languageMap: any = {
    c: { language: "c", versionIndex: "0" },
    cpp: { language: "cpp17", versionIndex: "0" },
    javascript: { language: "nodejs", versionIndex: "0" },
    python: { language: "python3", versionIndex: "0" },
  };

  useEffect(() => {
    if (!id) return;

    fetch(`/api/problems/${id}`)
      .then((res) => res.json())
      .then((data) => setProblem(data));
  }, [id]);



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

  const generateWrapper = (userCode: string, input: any) => {
  return `
#include <bits/stdc++.h>
using namespace std;

${userCode}

int main() {
    vector<int> nums = {${input.nums.join(",")}};
    int target = ${input.target};

    vector<int> ans = twoSum(nums, target);

    for(int x : ans) cout << x << " ";
    return 0;
}
`;
};

useEffect(() => {
  if (problem?.template) {
    setCode(problem.template);
  }
}, [problem]);


  // 🔥 RUN CODE
const runCode = async () => {
  setLoading(true);
  setResult("Running...");

  const finalCode = generateWrapper(code, problem.publicTestCase.input);

  try {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: finalCode,
        language: "cpp17",
        versionIndex: "0",
      }),
    });

    const data = await res.json();

    const output = data.output?.trim();

    setResult(`🧪 Output:\n${output}`);
  } catch {
    setResult("Server error");
  }

  setLoading(false);
};

// submit code 
const submitCode = async () => {
  setLoading(true);
  setResult("Running all test cases...\n");

  let allPassed = true;
  let finalResult = "";

  for (let i = 0; i < problem.privateTestCases.length; i++) {
    const tc = problem.privateTestCases[i];

    const finalCode = generateWrapper(code, tc.input);

    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: finalCode,
        language: "cpp17",
        versionIndex: "0",
      }),
    });

    const data = await res.json();
    const output = data.output?.trim();

    if (output === tc.output) {
      finalResult += `Test ${i + 1}: ✔ Passed\n`;
    } else {
      finalResult += `Test ${i + 1}: ❌ Failed\nExpected: ${tc.output}\nGot: ${output}\n\n`;
      allPassed = false;
    }
  }

  if (allPassed) {
    finalResult = "🎉 Accepted\n\n" + finalResult;
  } else {
    finalResult = "❌ Wrong Answer\n\n" + finalResult;
  }

  setResult(finalResult);
  setLoading(false);
};

///

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!problem) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex h-[90vh]">
      {/* 🔥 LEFT SIDE */}
      <div className="w-1/2 p-6 overflow-y-auto border-r border-white/10 bg-[#0d0d0d]">
        <h1 className="text-xl font-semibold mb-4 text-yellow-400">
          {problem?.id}. {problem?.title}
        </h1>

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

        <p className="mt-4 text-gray-300 whitespace-pre-line">
          {problem?.description}
        </p>
      </div>

      {/* 🔥 RIGHT SIDE */}
      <div className="w-1/2 flex flex-col bg-[#0b0b0b]">
        {/* Editor */}
        <div style={{ height: `${editorHeight}%` }} className="flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              language={lang === "cpp" ? "cpp" : lang}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center px-4 py-2 border-t border-white/10 bg-[#0f0f0f]">
            <div className="text-xs text-gray-400">
              Language: {lang.toUpperCase()}
            </div>

            <div className="flex gap-3">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-black border border-white/10 text-white text-sm px-2 py-1 rounded"
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>

              <button
                onClick={runCode}
                disabled={cooldown || loading}
                className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm disabled:opacity-50"
              >
                {loading ? "Running..." : cooldown ? "Wait..." : "Run"}
              </button>

              <button onClick={submitCode} className="px-4 py-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-white text-sm">
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Drag */}
        <div
          onMouseDown={handleMouseDown}
          className="h-2 cursor-row-resize bg-white/10 hover:bg-yellow-400 z-100"
        />

        {/* Result */}
        <div
          style={{ height: `${100 - editorHeight}%` }}
          className="p-4 overflow-y-auto bg-black z-100"
        >
          <h2 className="text-sm text-gray-400 mb-3">🧪 Test Result</h2>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <pre className="text-gray-200 whitespace-pre-wrap">
              {result || "Run your code to see result"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}