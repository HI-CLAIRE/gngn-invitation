import { useEffect, useState } from 'react';

type Options = {
  /** 글자 하나당 간격(ms) */
  msPerChar?: number;
  /** 줄이 끝난 뒤 다음 줄로 넘어가기 전 쉬는 시간(ms) */
  linePause?: number;
};

/**
 * 여러 줄을 한 글자씩 타이핑하듯 보여준다.
 * 글자가 나타나는 효과는 화면 움직임이 아니므로 '동작 줄이기' 설정과 무관하게 동작한다.
 */
export function useTypewriter(lines: string[], active: boolean, { msPerChar = 55, linePause = 450 }: Options = {}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (active) return;
    setLineIndex(0);
    setCharIndex(0);
    setDone(false);
  }, [active]);

  useEffect(() => {
    if (!active || done) return;
    const current = lines[lineIndex];
    if (current === undefined) {
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
      }, linePause);
      return () => clearTimeout(t);
    }
    const t = window.setTimeout(() => setCharIndex((c) => c + 1), msPerChar);
    return () => clearTimeout(t);
  }, [active, charIndex, done, lineIndex, linePause, lines, msPerChar]);

  const visibleLines = lines.slice(0, lineIndex + 1).map((line, i) =>
    i < lineIndex ? line : line.slice(0, charIndex),
  );

  return { visibleLines, done, lineIndex };
}
