import { useMemo, useState } from 'react';
import { IMAGES } from '../../config/images';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GngnButton } from '../ui/GngnButton';

const PROGRAM_POOL = ['마피아 게임', '마니또', '근황 토크', '랜덤 선물 교환'] as const;

const AI_REPORTS: Record<(typeof PROGRAM_POOL)[number], string> = {
  '마피아 게임':
    '【AI 분석】 귀하의 퀸 네트워크는 “의심과 연대”의 최적 균형점에 위치합니다. 마피아 게임은 통계적으로 웃음 지수를 37% 상승시킬 것으로 추정됩니다. (추정치이며, 실제 결과는 인간의 예측 불가능성에 좌우됩니다.)',
  마니또:
    '【AI 분석】 선물 교환 알고리즘과의 시너지가 높습니다. 마니또는 “누가 나를 챙겼는지”에 대한 감성 데이터를 수집하기에 적합합니다. (수집된 데이터는 어디에도 저장되지 않습니다. 아마도.)',
  '근황 토크':
    '【AI 분석】 발화량 대비 만족도 상관계수가 0.89로 보고됩니다. 근황 토크는 GNGN의 핵심 KPI인 “함께 웃기”에 직접 기여합니다.',
  '랜덤 선물 교환':
    '【AI 분석】 랜덤성은 42%의 서프라이즈 효과를 유발합니다. 선물 교환 모듈 활성화를 권장합니다.',
};

type Props = { onComplete: () => void };

export function SceneInvitation({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [sealed, setSealed] = useState(true);
  const [verifyProgress, setVerifyProgress] = useState<number | null>(null);
  const [verifyDone, setVerifyDone] = useState(false);
  const [aiPick, setAiPick] = useState<string | null>(null);

  const runVerify = () => {
    if (verifyDone || verifyProgress !== null) return;
    setVerifyProgress(0);
    const steps = reduced ? 1 : 20;
    let i = 0;
    const tick = () => {
      i += 1;
      setVerifyProgress(Math.min(100, Math.round((i / steps) * 100)));
      if (i < steps) window.setTimeout(tick, reduced ? 50 : 80);
      else {
        setVerifyDone(true);
        setVerifyProgress(100);
      }
    };
    tick();
  };

  const stats = useMemo(
    () => [
      { label: '업무 외 수다 시간', value: '측정 불가' },
      { label: '퇴사·이직·생존 경험치', value: 'MAX' },
      { label: '단체 모임 필요 지수', value: '9999' },
      { label: '사회적 배터리', value: '충전 필요' },
    ],
    [],
  );

  const recommendProgram = () => {
    const pick = PROGRAM_POOL[Math.floor(Math.random() * PROGRAM_POOL.length)]!;
    setAiPick(AI_REPORTS[pick]);
  };

  return (
    <section className="scene-invitation" aria-label="THE OFFICIAL INVITATION">
      <button
        type="button"
        className={`invite-card ${sealed ? 'invite-card--sealed' : 'invite-card--open'}`}
        onClick={() => setSealed(false)}
        aria-expanded={!sealed}
        aria-label={sealed ? '봉인된 초대장 — 클릭하여 펼치기' : '초대장 펼침'}
      >
        <div className="invite-card__seal">{sealed ? 'GN SEALED' : 'GN OFFICIAL'}</div>
        <div className="invite-card__body">
          <h1 className="invite-card__title">GNGN — GN Girls Night</h1>
          <p className="invite-card__lead">
            GN의 현직·전직 여성 구성원을 위한 송년·신년회
          </p>
          <dl className="invite-card__details">
            <div>
              <dt>행사 목적</dt>
              <dd>한 해를 마무리하고 새해를 맞이하며 함께 노는 시간</dd>
            </div>
            <div>
              <dt>날짜</dt>
              <dd>참석자 투표로 결정</dd>
            </div>
            <div>
              <dt>장소</dt>
              <dd>추후 결정 또는 별도 안내</dd>
            </div>
            <div>
              <dt>드레스 코드</dt>
              <dd>핑크, 레드, 블랙 중 택 1 또는 자유 복장</dd>
            </div>
            <div>
              <dt>프로그램</dt>
              <dd>
                마피아 게임, 마니또, 익명 퀸 찾기, 근황 토크, 랜덤 선물 교환 등
              </dd>
            </div>
            <div>
              <dt>준비물</dt>
              <dd>선물 교환 진행 시 선물, 그리고 체력</dd>
            </div>
            <div>
              <dt>참석 방법</dt>
              <dd>날짜 투표 후 오픈 카톡방 입장</dd>
            </div>
          </dl>
          <p className="invite-card__footer">ATTENDANCE IS HIGHLY RECOMMENDED.</p>
        </div>
      </button>

      <div className="invite-extras">
        <article className="invite-panel">
          <h2>퀸 자격 검증 센터</h2>
          <img src={IMAGES.queenEmoji} alt="" className="invite-panel__queen" />
          <GngnButton variant="pink" onClick={runVerify} disabled={verifyProgress !== null && !verifyDone}>
            퀸 자격 검증 시작
          </GngnButton>
          {verifyProgress !== null && (
            <div className="verify-bar" role="progressbar" aria-valuenow={verifyProgress} aria-valuemin={0} aria-valuemax={100}>
              <div className="verify-bar__fill" style={{ width: `${verifyProgress}%` }} />
              <span>{verifyProgress}%</span>
            </div>
          )}
          {verifyDone && (
            <p className="verify-result">검증 완료: 퀸 등급 측정 불가 (너무 높음)</p>
          )}
        </article>

        <article className="invite-panel">
          <h2>금년도 업적 통계</h2>
          <p className="invite-panel__disclaimer">※ 아래 수치는 100% 가짜 통계입니다.</p>
          <ul className="stat-cards">
            {stats.map((s) => (
              <li key={s.label} className="stat-card">
                <span className="stat-card__label">{s.label}</span>
                <span className="stat-card__value">{s.value}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="invite-panel">
          <h2>AI 추천 프로그램</h2>
          <GngnButton onClick={recommendProgram}>AI 분석 실행</GngnButton>
          {aiPick && <p className="ai-report">{aiPick}</p>}
        </article>
      </div>

      <GngnButton variant="dark" className="scene-invitation__next" onClick={onComplete}>
        퀸 일정 투표하러 가기
      </GngnButton>
    </section>
  );
}
