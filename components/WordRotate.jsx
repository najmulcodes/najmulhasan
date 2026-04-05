"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function WordRotate({ words = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [words]);

  return (
    <span style={{ display: "inline-block" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          style={{
            display: "inline-block",
            direction: /[\u0600-\u06FF]/.test(words[index]) ? "rtl" : "ltr"
          }}
          initial={{
            opacity: 0,
            y: 6,
            filter: "blur(6px)"
          }}
          animate={{
            opacity: 0.85,
            y: 0,
            filter: "blur(0px)"
          }}
          exit={{
            opacity: 0,
            y: -6,
            filter: "blur(6px)"
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}