import { useCallback, useState } from 'react';
import { siteConfig } from '../../config/site';
import { GngnButton } from '../ui/GngnButton';
import { RunawayNoButton } from '../ui/RunawayNoButton';

/** 아니오를 이만큼 시도하면 포기 안내 표시 */
const GIVE_UP_ATTEMPTS = 7;

export function SceneSecretGate() {
  const [message, setMessage] = useState<string | null>(null);
  const [showGiveUp, setShowGiveUp] = useState(false);

  const handleEnter = () => {
    const url = siteConfig.kakaoOpenChatUrl;
    if (!url) {
      setMessage(
        '오픈 카톡 URL이 아직 설정되지 않았습니다. 운영진에게 문의하거나 .env의 VITE_KAKAO_OPEN_CHAT_URL을 설정해 주세요.',
      );
      return;
    }
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setMessage('유효하지 않은 오픈 카톡 URL입니다.');
        return;
      }
      window.open(parsed.href, '_blank', 'noopener,noreferrer');
      setMessage(null);
    } catch {
      setMessage('유효하지 않은 오픈 카톡 URL입니다.');
    }
  };

  const handleNoAttempt = useCallback((attempts: number) => {
    if (attempts >= GIVE_UP_ATTEMPTS) setShowGiveUp(true);
  }, []);

  return (
    <section className="scene-gate" aria-label="THE SECRET GATE">
      <div className="scene-gate__veil" />
      <h1 className="scene-gate__title">YOU ARE A QUEEN.</h1>
      <p className="scene-gate__copy">
        초대장 확인 완료. 퀸 자격 검증 완료. 이제 마지막 관문만 남았습니다.
      </p>
      <p className="scene-gate__question">GNGN 퀸 집회에 참석하시겠습니까?</p>
      <div className="scene-gate__choices">
        <GngnButton variant="gold" className="scene-gate__yes" onClick={handleEnter}>
          예, 입장할게요 👑
        </GngnButton>
        <RunawayNoButton onAttempt={handleNoAttempt} />
      </div>
      {showGiveUp && (
        <p className="scene-gate__give-up" role="status">
          포기하세요. 답은 &lsquo;예&rsquo;입니다 👑
        </p>
      )}
      {message && (
        <p className="scene-gate__alert" role="alert">
          {message}
        </p>
      )}
      <p className="scene-gate__footnote">
        예를 누르면 오픈 카톡방으로 이동합니다. AI 분석 결과, 예를 누를 확률은 100%입니다.
      </p>
    </section>
  );
}
