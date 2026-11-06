"use client";

import { motion } from "framer-motion";

// Arabic letters join each other, so a word must stay in one piece: splitting it into one element per letter
// (each one animated) makes Safari draw the letters disconnected. Arabic is animated word by word instead.
const hasArabic = (value) => /[؀-ۿ]/.test(value);
const pieces = (value) => (hasArabic(value) ? value.split(/(\s+)/).filter(Boolean) : value.split(""));

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
        {pieces(text).map((piece, i) =>
          piece.trim() === "" && piece !== "" ? (
            piece
          ) : (
            <motion.span key={`text-${i}`} variants={letter} className="inline">
              {piece}
            </motion.span>
          )
        )}
      </span>
      {highlightText && (
        <span className="text-main inline">
          {pieces(highlightText).map((piece, i) =>
            piece.trim() === "" && piece !== "" ? (
              piece
            ) : (
              <motion.span key={`hl-${i}`} variants={letter} className="inline">
                {piece}
              </motion.span>
            )
          )}
        </span>
      )}
    </motion.span>
  );
}

export default TypewriterText;
