import { useEffect, useState } from 'react';
import { IMAGES } from '../../config/images';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const MESSAGES = ['…관찰 중입니다.', '…퀸 감지됨.', '…별말 없음.'];

export function RandomCatPopup() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState(MESSAGES[0]);

  useEffect(() => {
    if (reduced) return;
    let timeout: number;
    const schedule = () => {
      const delay = 12000 + Math.random() * 18000;
      timeout = window.setTimeout(() => {
        setMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]!);
        setVisible(true);
        window.setTimeout(() => setVisible(false), 2200);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [reduced]);

  if (!visible) return null;

  return (
    <div className="random-cat" aria-hidden>
      <img src={IMAGES.randomCat} alt="" className="random-cat__img" />
      <span className="random-cat__tag">{msg}</span>
    </div>
  );
}
