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

  useEffect(() => {
    if (!id) return;

    fetch(`/api/problems/${id}`)
      .then((res) => res.json())
      .then((data) => setProblem(data));
  }, [id]);

  // resize logic
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

  if (!problem) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex h-[90vh]">

      {/* 🔥 LEFT SIDE */}
      <div className="w-1/2 p-6 overflow-y-auto border-r border-white/10 bg-[#0d0d0d]">
        <h1 className="text-xl font-semibold mb-4 text-yellow-400">
          {problem.id}. {problem.title}
        </h1>

       <span
  className={`px-2 py-1 text-xs rounded font-medium ${
    problem.difficulty === "Easy"
      ? "bg-green-500/10 text-green-400"
      : problem.difficulty === "Medium"
      ? "bg-yellow-500/10 text-yellow-400"
      : "bg-red-500/10 text-red-400"
  }`}
>
  {problem.difficulty}
</span>

        <p className="mt-4 text-gray-300 whitespace-pre-line leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* 🔥 RIGHT SIDE */}
      <div className="w-1/2 flex flex-col bg-[#0b0b0b]">

        {/* Editor */}
        <div style={{ height: `${editorHeight}%` }}>
          <Editor
            height="100%"
            language="cpp"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
          />
        </div>

        {/* Drag */}
        <div
          onMouseDown={handleMouseDown}
          className="h-2 cursor-row-resize bg-white/10 hover:bg-yellow-400 transition"
        />

        {/* Result */}
        <div
          style={{ height: `${100 - editorHeight}%` }}
          className="p-4 overflow-y-auto"
        >
          <h2 className="text-sm text-gray-400 mb-3">
            🧪 Test Result
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-green-400">✔ Accepted</p>
            <p className="text-gray-400 text-sm mt-2">
              Output: 2
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}