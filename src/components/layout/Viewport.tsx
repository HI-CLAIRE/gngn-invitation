import type { ReactNode } from 'react';
import { AmbientBackground } from './AmbientBackground';

type Props = { children: ReactNode };

export function Viewport({ children }: Props) {
  return (
    <div className="viewport">
      <AmbientBackground />
      {children}
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>
    </div>
  );
}
