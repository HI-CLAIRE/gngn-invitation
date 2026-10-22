import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/** CSS로 그린 말풍선 — 꼬리가 위쪽(말하는 고양이)을 향함 */
export function SpeechBubble({ children, className = '' }: Props) {
  return (
    <div className={`speech-bubble ${className}`.trim()} role="region" aria-live="polite">
      <div className="speech-bubble__text">{children}</div>
    </div>
  );
}
