"use client";

import { useEffect, useState } from "react";

export default function TypingText() {
  const words = ["Code.", "Solve.", "Repeat."];
  const colors = ["text-green-400", "text-yellow-400", "text-orange-400"];

  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(currentWord.substring(0, text.length + 1));

        if (text === currentWord) {
          setTimeout(() => setDeleting(true), 1200);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));

        if (text === "") {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, deleting ? 35 : 85); // 🔥 smooth human-like speed

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex]);

  return (
    <span
      className={`${colors[wordIndex]} font-semibold text-lg transition-all duration-500`}
    >
      {text}
      <span className="ml-1 inline-block w-0.5 h-5 bg-white animate-blink" />
    </span>
  );
}