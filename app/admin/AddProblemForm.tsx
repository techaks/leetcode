"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  FileText,
  Code,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AddProblemForm() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState("");
  const [constraints, setConstraints] = useState("");

  const [examples, setExamples] = useState([{ input: "", output: "" }]);
  const [publicTC, setPublicTC] = useState([{ input: "", output: "" }]);
  const [privateTC, setPrivateTC] = useState([{ input: "", output: "" }]);

  const [cpp, setCpp] = useState("");
  const [python, setPython] = useState("");
  const [cppWrapper, setCppWrapper] = useState("");
const [pythonWrapper, setPythonWrapper] = useState("");

  const addItem = (setter: any, state: any) =>
    setter([...state, { input: "", output: "" }]);

  const removeItem = (setter: any, state: any, i: number) =>
    setter(state.filter((_: any, idx: number) => idx !== i));

  const updateItem = (
    setter: any,
    state: any,
    i: number,
    key: string,
    value: string
  ) => {
    const newArr = [...state];
    newArr[i][key] = value;
    setter(newArr);
  };

const submit = async () => {
  if (!title.trim()) return alert("Title is required");
  if (!description.trim()) return alert("Description is required");
  if (!constraints.trim()) return alert("Constraints is required");

  if (!examples.length || !examples[0].input || !examples[0].output) {
    return alert("At least one example is required");
  }

  if (!publicTC.length || !publicTC[0].input || !publicTC[0].output) {
    return alert("Public test case required");
  }

  if (!privateTC.length || !privateTC[0].input || !privateTC[0].output) {
    return alert("Private test case required");
  }

  // 🔥 YAHI DALNA HAI (important)
  if (!cppWrapper.includes("USER_CODE_HERE")) {
    return alert("C++ wrapper must contain USER_CODE_HERE");
  }

  if (!pythonWrapper.includes("USER_CODE_HERE")) {
  return alert("Python wrapper must contain USER_CODE_HERE");
}

  try {
    await fetch("/api/admin/add-problem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        difficulty,
        description,
        functionName: "solve",
        constraints,
        examples,
        publicTestCases: publicTC.map(tc => ({
          input: JSON.parse(tc.input || "{}"),
          output: tc.output,
        })),
        privateTestCases: privateTC.map(tc => ({
          input: JSON.parse(tc.input || "{}"),
          output: tc.output,
        })),
        templates: {
          cpp,
          python,
        },
        wrappers: {
          cpp: cppWrapper,
          python: pythonWrapper,
        },
      }),
    });

    toast.success("✅ Problem Added");
  } catch {
    toast.error("❌ Error");
  }
};

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-[#0d0d0d] to-[#111] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* BASIC INFO */}
        <Section icon={<FileText />} title="Basic Info">

          {/* GRID FIX */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Problem Title"
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />

            {/* DROPDOWN FIX */}
            <select
              onChange={(e) => setDifficulty(e.target.value)}
              className="input bg-[#0b0b0b] text-white"
            >
              <option className="bg-black">Easy</option>
              <option className="bg-black">Medium</option>
              <option className="bg-black">Hard</option>
            </select>
          </div>

          <textarea
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            className="input h-32 mt-3"
          />

          <textarea
            placeholder="Constraints"
            onChange={(e) => setConstraints(e.target.value)}
            className="input h-24 mt-3"
          />
        </Section>

        {/* EXAMPLES */}
        <DynamicSection
          title="Examples"
          icon={<FlaskConical />}
          data={examples}
          setData={setExamples}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={updateItem}
        />

        {/* PUBLIC */}
        <DynamicSection
          title="Public Test Cases"
          icon={<Code />}
          data={publicTC}
          setData={setPublicTC}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={updateItem}
        />

        {/* PRIVATE */}
        <DynamicSection
          title="Private Test Cases"
          icon={<ShieldCheck />}
          data={privateTC}
          setData={setPrivateTC}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={updateItem}
        />

        {/* TEMPLATE */}
        <Section icon={<Code />} title="Code Templates">
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              placeholder="C++ Template"
              onChange={(e) => setCpp(e.target.value)}
              className="input h-32"
            />
            <textarea
              placeholder="Python Template"
              onChange={(e) => setPython(e.target.value)}
              className="input h-32"
            />
          </div>
        </Section>

        <Section icon={<Code />} title="Code Wrappers (Important)">

  <div className="grid md:grid-cols-2 gap-4">

    <textarea
      placeholder={`C++ Wrapper (use // USER_CODE_HERE)
Example:
#include <bits/stdc++.h>
using namespace std;

// USER_CODE_HERE

int main(){
  int a = 2, b = 3;
  cout << solve(a,b);
}`}
      onChange={(e) => setCppWrapper(e.target.value)}
      className="input h-40"
    />

    <textarea
      placeholder={`Python Wrapper
Example:
# USER_CODE_HERE

print(solve(2,3))`}
      onChange={(e) => setPythonWrapper(e.target.value)}
      className="input h-40"
    />

  </div>

</Section>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={submit}
          className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition"
        >
          🚀 Add Problem
        </motion.button>
      </div>

      {/* STYLE FIX */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          font-size: 14px;
        }
        .input:focus {
          outline: none;
          border-color: #facc15;
          box-shadow: 0 0 0 1px #facc15;
        }
      `}</style>
    </div>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
      <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function DynamicSection({
  title,
  icon,
  data,
  setData,
  addItem,
  removeItem,
  updateItem,
}: any) {
  return (
    <Section title={title} icon={icon}>
      {data.map((item: any, i: number) => (
        <div key={i} className="mb-4 border border-white/10 p-4 rounded-lg">

          {/* GRID FIX */}
          <div className="grid md:grid-cols-2 gap-3">
            <textarea
              placeholder="Input (JSON)"
              value={item.input}
              onChange={(e) =>
                updateItem(setData, data, i, "input", e.target.value)
              }
              className="input h-24 border rounded-md border-yellow-900 p-2"
            />

            <textarea
              placeholder="Output"
              value={item.output}
              onChange={(e) =>
                updateItem(setData, data, i, "output", e.target.value)
              }
              className="input h-24 border rounded-md border-yellow-900 p-2"
            />
          </div>

          <button
            onClick={() => removeItem(setData, data, i)}
            className="mt-2 text-red-400 flex items-center gap-1"
          >
            <Trash2 size={16} /> Remove
          </button>
        </div>
      ))}

      <button
        onClick={() => addItem(setData, data)}
        className="flex items-center gap-2 text-yellow-400 mt-2"
      >
        <Plus size={16} /> Add {title}
      </button>
    </Section>
  );
}