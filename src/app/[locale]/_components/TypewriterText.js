"use client";

import { motion } from "framer-motion";

function TypewriterText({ text = "", highlightText = "" }) {
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
    },
  };

  return (
    <motion.span
      variants={sentence}
      initial="hidden"
      animate="visible"
      className="inline"
    >
      <span className="text-white inline">
        {text.split("").map((char, i) => (
          <motion.span key={`text-${i}`} variants={letter} className="inline">
            {char}
          </motion.span>
        ))}
      </span>
      {highlightText && (
        <span className="text-main inline">
          {highlightText.split("").map((char, i) => (
            <motion.span key={`hl-${i}`} variants={letter} className="inline">
              {char}
            </motion.span>
          ))}
        </span>
      )}
    </motion.span>
  );
}

export default TypewriterText;
