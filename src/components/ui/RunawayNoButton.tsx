import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** 시도 횟수에 따라 바뀌는 버튼 문구 */
const LABELS = [
  '아니오',
  '진짜요?',
  '다시 생각해봐요',
  '못 잡지롱',
  '퀸은 도망 안 가요',
  '거의 다 왔… 아님',
  '포기하세요',
];

/** 화면 가장자리와의 최소 여백(px) */
const EDGE_GAP = 16;
/** 날개가 버튼 밖으로 튀어나오는 폭(px) — 화면 안 유지 계산에 포함 */
const WING_SPAN = 34;
/** 마우스가 버튼 테두리에서 이 거리 안으로 들어오면 도망(px) */
const FLEE_RADIUS = 60;
/** 도망갈 위치는 포인터에서 최소 이만큼 떨어지도록(px) */
const SAFE_DISTANCE = 160;
/** 연속 도망 사이 최소 간격(ms) — 이동 중 중복 트리거 방지 */
const FLEE_COOLDOWN = 250;

type Point = { x: number; y: number };
type Size = { width: number; height: number };

type Props = {
  /** 아니오를 시도할 때마다 누적 횟수와 함께 호출 */
  onAttempt?: (attempts: number) => void;
};

function getBounds(size: Size) {
  const minX = EDGE_GAP + WING_SPAN;
  const minY = EDGE_GAP;
  return {
    minX,
    minY,
    maxX: Math.max(minX, window.innerWidth - size.width - EDGE_GAP - WING_SPAN),
    maxY: Math.max(minY, window.innerHeight - size.height - EDGE_GAP),
  };
}

function clampToViewport(point: Point, size: Size): Point {
  const { minX, minY, maxX, maxY } = getBounds(size);
  return {
    x: Math.min(Math.max(point.x, minX), maxX),
    y: Math.min(Math.max(point.y, minY), maxY),
  };
}

/** 화면 안에서 포인터와 충분히 떨어진 무작위 좌표 선택 */
function pickTarget(size: Size, avoid: Point | null): Point {
  const { minX, minY, maxX, maxY } = getBounds(size);
  let best: Point = { x: minX, y: minY };
  let bestDist = -1;

  for (let i = 0; i < 12; i += 1) {
    const candidate = {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
    };
    if (!avoid) return candidate;
    const dist = Math.hypot(
      candidate.x + size.width / 2 - avoid.x,
      candidate.y + size.height / 2 - avoid.y,
    );
    if (dist >= SAFE_DISTANCE) return candidate;
    if (dist > bestDist) {
      best = candidate;
      bestDist = dist;
    }
  }
  return best;
}

function Wing({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      className={`runaway-no__wing runaway-no__wing--${side}`}
      viewBox="0 0 40 32"
      aria-hidden
    >
      <g transform={side === 'right' ? 'translate(40 0) scale(-1 1)' : undefined}>
        <path
          d="M38 18C30 4 14 0 2 4c6 4 8 6 10 8-6 0-9 2-11 5 7 1 11 2 13 3-5 2-7 4-8 7 10-1 22-3 32-9Z"
          fill="#fff"
          stroke="#d4af37"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function RunawayNoButton({ onAttempt }: Props) {
  const reduced = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sizeRef = useRef<Size>({ width: 0, height: 0 });
  const flyingRef = useRef(false);
  const lastFleeRef = useRef(0);
  const rafRef = useRef(0);

  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState<Point | null>(null);
  const [tilt, setTilt] = useState(0);
  const [placeholder, setPlaceholder] = useState<Size | null>(null);

  const flee = useCallback((pointer: Point | null) => {
    const now = performance.now();
    if (now - lastFleeRef.current < FLEE_COOLDOWN) return;
    lastFleeRef.current = now;

    const button = buttonRef.current;
    if (!button) return;

    const size = { width: button.offsetWidth, height: button.offsetHeight };
    sizeRef.current = size;
    const rect = button.getBoundingClientRect();
    const target = pickTarget(size, pointer);

    // 이동 방향으로 살짝 기울이기
    setTilt(Math.max(-18, Math.min(18, (target.x - rect.left) / 20)));
    setAttempts((prev) => prev + 1);

    if (!flyingRef.current) {
      // 첫 비행: 현재 자리에서 고정 위치로 전환한 뒤 다음 프레임에 목표로 이동
      flyingRef.current = true;
      setPlaceholder(size);
      setPosition({ x: rect.left, y: rect.top });
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => setPosition(target));
      });
      return;
    }
    setPosition(target);
  }, []);

  useEffect(() => {
    if (attempts > 0) onAttempt?.(attempts);
  }, [attempts, onAttempt]);

  // 데스크톱: 마우스가 가까이 오기만 해도 도망
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const button = buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      if (Math.hypot(dx, dy) < FLEE_RADIUS) flee({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [flee]);

  // 창 크기가 바뀌어도 화면 밖으로 나가지 않도록 보정
  useEffect(() => {
    const onResize = () => {
      setPosition((prev) => (prev ? clampToViewport(prev, sizeRef.current) : prev));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const label = LABELS[Math.min(attempts, LABELS.length - 1)];

  // 문구가 바뀌어 버튼 폭이 달라지면 다시 측정해 화면 안으로 보정
  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button || !flyingRef.current) return;
    const size = { width: button.offsetWidth, height: button.offsetHeight };
    sizeRef.current = size;
    setPosition((prev) => {
      if (!prev) return prev;
      const next = clampToViewport(prev, size);
      return next.x === prev.x && next.y === prev.y ? prev : next;
    });
  }, [label]);

  // 모바일 포함: 클릭이 성립하기 전, 누르는 순간 도망
  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    flee({ x: e.clientX, y: e.clientY });
  };

  // 클릭은 절대 성립하지 않음
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    flee(null);
  };

  const flying = position !== null;

  const button = (
    <button
      ref={buttonRef}
      type="button"
      className={`gngn-btn gngn-btn--dark runaway-no ${flying ? 'runaway-no--flying' : ''}`.trim()}
      style={
        position
          ? {
              transform: `translate(${position.x}px, ${position.y}px) rotate(${tilt}deg)`,
              transition: reduced ? 'none' : undefined,
            }
          : undefined
      }
      aria-label="아니오 (누를 수 없음)"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {attempts > 0 && (
        <>
          <Wing side="left" />
          <Wing side="right" />
        </>
      )}
      <span>{label}</span>
    </button>
  );

  if (!flying) return button;

  return (
    <>
      {/* 버튼이 날아간 자리의 레이아웃 유지용 */}
      {placeholder && (
        <span
          className="runaway-no__placeholder"
          style={{ width: placeholder.width, height: placeholder.height }}
          aria-hidden
        />
      )}
      {createPortal(button, document.body)}
    </>
  );
}
