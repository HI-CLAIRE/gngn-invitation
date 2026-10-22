import { useEffect, useRef, useState } from 'react';
import { IMAGES } from '../../config/images';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTypewriter } from '../../hooks/useTypewriter';
import { GngnButton } from '../ui/GngnButton';
import { SpeechBubble } from '../ui/SpeechBubble';

const DIALOGUE = [
  '안녕하십니까, GN의 퀸 여러분.',
  '오늘도 여러분의 미모와 존재 가치는 정상 범위를 초과했습니다.',
  '금일 저는 매우 중요한 소식을 전달하러 왔습니다.',
];

type Phase =
  | 'intro'
  | 'loading'
  | 'ready'
  | 'curtain-open'
  | 'cat'
  | 'thumbs'
  | 'done';

type Props = { onComplete: () => void };

export function SceneOpening({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('intro');
  const showDialogue = phase === 'cat' || phase === 'thumbs' || phase === 'done';
  // 대사가 끝난 뒤에도 말풍선 내용이 유지되도록 cat 이후 단계 내내 활성 상태로 둔다
  // 고양이가 다 올라온 뒤에 타이핑을 시작해야 첫 줄부터 글자가 생기는 게 보인다
  const [typingReady, setTypingReady] = useState(false);
  const { visibleLines, done: dialogueDone } = useTypewriter(DIALOGUE, showDialogue && typingReady);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== 'intro') return;
    const t = window.setTimeout(() => setPhase('loading'), reduced ? 200 : 1200);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const t = window.setTimeout(() => setPhase('ready'), reduced ? 300 : 2800);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== 'cat') return;
    const t = window.setTimeout(() => setTypingReady(true), reduced ? 100 : 800);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase === 'cat' && dialogueDone) {
      const t = window.setTimeout(() => setPhase('thumbs'), reduced ? 100 : 600);
      return () => clearTimeout(t);
    }
  }, [phase, dialogueDone, reduced]);

  // 엄지척 고양이와 다음 버튼이 화면 아래에 가려지지 않도록 스크롤
  useEffect(() => {
    if (phase !== 'thumbs') return;
    const t = window.setTimeout(() => {
      thumbsRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }, 300);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== 'curtain-open') return;
    const t = window.setTimeout(() => setPhase('cat'), reduced ? 150 : 900);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  const curtainOpen = phase === 'curtain-open' || phase === 'cat' || phase === 'thumbs' || phase === 'done';
  const showCat = phase === 'cat' || phase === 'thumbs' || phase === 'done';

  return (
    <section className="scene-opening" aria-label="THE GRAND OPENING">
      <div
        className="scene-opening__stage"
        style={{ backgroundImage: `url(${IMAGES.curtainSpotlights})` }}
      >
        <div className={`scene-opening__curtain scene-opening__curtain--left ${curtainOpen ? 'is-open' : ''}`} />
        <div className={`scene-opening__curtain scene-opening__curtain--right ${curtainOpen ? 'is-open' : ''}`} />

        {!curtainOpen && (
          <div className="scene-opening__hero">
            <p className="scene-opening__title is-visible">GNGN PRESENTS...</p>
            {phase === 'loading' && (
              <div className="scene-opening__loader" role="status" aria-label="무대 준비 중">
                <span className="scene-opening__loader-bar" />
                <span className="scene-opening__loader-text">무대 조명을 과도하게 튜닝하는 중…</span>
              </div>
            )}
            {phase === 'ready' && (
              <GngnButton
                className="scene-opening__start"
                onClick={() => setPhase('curtain-open')}
              >
                퀸들의 입장 시작하기
              </GngnButton>
            )}
          </div>
        )}

        {curtainOpen && (
          <div
            className="scene-opening__inner"
            style={{ backgroundImage: `url(${IMAGES.curtainMic})` }}
          >
            {showCat && (
              <div className={`scene-opening__cat ${showCat ? 'is-in' : ''}`}>
                <span className="scene-opening__cat-frame">
                  <img src={IMAGES.mainCat} alt="GNGN AI 안내 고양이" className="scene-opening__cat-img" />
                </span>
                {(phase === 'cat' || phase === 'thumbs' || phase === 'done') && (
                  <SpeechBubble>
                    {visibleLines.map((line, i) => (
                      <p key={i}>
                        {line}
                        {/* 지금 타이핑 중인 줄 끝에 깜빡이는 커서 */}
                        {!dialogueDone && i === visibleLines.length - 1 && (
                          <span className="type-caret" aria-hidden />
                        )}
                        {!line && dialogueDone && '\u00A0'}
                      </p>
                    ))}
                  </SpeechBubble>
                )}
              </div>
            )}

            {phase === 'thumbs' || phase === 'done' ? (
              <div ref={thumbsRef} className="scene-opening__thumbs">
                <span className="scene-opening__thumbs-frame">
                  <img src={IMAGES.thumbsUpCat} alt="" className="scene-opening__thumbs-img" />
                </span>
                <div className="scene-opening__thumbs-text">
                  <p>네. 그냥 다 같이 놀자는 뜻입니다.</p>
                  <p>감사합니다. 👍</p>
                </div>
              </div>
            ) : null}

            {(phase === 'thumbs' || phase === 'done') && (
              <GngnButton
                variant="pink"
                className="scene-opening__next"
                onClick={() => {
                  setPhase('done');
                  onComplete();
                }}
              >
                공식 초대장 확인하기
              </GngnButton>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
