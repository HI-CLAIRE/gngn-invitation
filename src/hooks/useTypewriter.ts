import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useTypewriter(lines: string[], active: boolean, msPerChar = 35) {
  const reduced = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setLineIndex(0);
      setCharIndex(0);
      setDone(false);
      return;
    }
    if (reduced) {
      setLineIndex(lines.length - 1);
      setCharIndex(lines[lines.length - 1]?.length ?? 0);
      setDone(true);
      return;
    }
    setLineIndex(0);
    setCharIndex(0);
    setDone(false);
  }, [active, lines, reduced]);

  useEffect(() => {
    if (!active || done || reduced) return;
    const current = lines[lineIndex];
    if (!current) {
      setDone(true);
      return;
    }
    if (charIndex >= current.length) {
      if (lineIndex >= lines.length - 1) {
        setDone(true);
        return;
      }
      const t = window.setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, 400);
      return () => clearTimeout(t);
    }
    const t = window.setTimeout(() => setCharIndex((c) => c + 1), msPerChar);
    return () => clearTimeout(t);
  }, [active, charIndex, done, lineIndex, lines, msPerChar, reduced]);

  const visibleLines = lines.slice(0, lineIndex + 1).map((line, i) =>
    i < lineIndex ? line : line.slice(0, charIndex),
  );

  return { visibleLines, done, lineIndex };
}
