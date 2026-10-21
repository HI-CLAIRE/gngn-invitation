import { useState } from 'react';
import { siteConfig } from '../../config/site';
import { GngnButton } from '../ui/GngnButton';

export function SceneSecretGate() {
  const [message, setMessage] = useState<string | null>(null);

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

  return (
    <section className="scene-gate" aria-label="THE SECRET GATE">
      <div className="scene-gate__veil" />
      <h1 className="scene-gate__title">YOU ARE A QUEEN.</h1>
      <p className="scene-gate__copy">
        초대장 확인 완료. 퀸 자격 검증 완료. 이제 마지막 관문만 남았습니다.
      </p>
      <p className="scene-gate__copy">
        오픈 카톡방에 입장하여 동료 퀸들을 만나세요.
      </p>
      <GngnButton variant="gold" className="scene-gate__cta" onClick={handleEnter}>
        퀸들의 비밀 집회 입장하기 👑
      </GngnButton>
      {message && (
        <p className="scene-gate__alert" role="alert">
          {message}
        </p>
      )}
      <p className="scene-gate__footnote">
        AI의 분석 결과, 이 버튼을 누를 확률은 99.9%입니다.
      </p>
    </section>
  );
}
