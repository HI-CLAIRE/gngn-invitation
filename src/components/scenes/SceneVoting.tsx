import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatVoteDeadline, isVoteClosed } from '../../config/site';
import {
  PROGRAM_OPTIONS,
  VOTE_DATE_OPTIONS,
  VOTE_MONTH_GROUPS,
  type ProgramId,
} from '../../config/voteDates';
import { IMAGES } from '../../config/images';
import {
  fetchVoteAggregate,
  getUserVote,
  submitVote,
  type AttendanceStatus,
  type VoteAggregate,
} from '../../services/votes';
import { GngnButton } from '../ui/GngnButton';

type Step = 'form' | 'confirm' | 'success';

type Props = { onComplete: () => void };

export function SceneVoting({ onComplete }: Props) {
  const closed = isVoteClosed();
  const existing = getUserVote();

  const [step, setStep] = useState<Step>(existing ? 'success' : 'form');
  const [selectedDates, setSelectedDates] = useState<Set<string>>(
    () => new Set(existing?.dateIds ?? []),
  );
  const [selectedPrograms, setSelectedPrograms] = useState<Set<ProgramId>>(
    () => new Set(existing?.programs ?? []),
  );
  const [attendance, setAttendance] = useState<AttendanceStatus>(existing?.attendance ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [aggregate, setAggregate] = useState<VoteAggregate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAggregate = useCallback(async () => {
    const agg = await fetchVoteAggregate();
    setAggregate(agg);
  }, []);

  useEffect(() => {
    void refreshAggregate();
  }, [refreshAggregate]);

  const toggleDate = (id: string) => {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleProgram = (id: ProgramId) => {
    setSelectedPrograms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canProceedConfirm =
    selectedDates.size > 0 && selectedPrograms.size > 0 && attendance !== '';

  const summaryDates = useMemo(
    () => VOTE_DATE_OPTIONS.filter((d) => selectedDates.has(d.id)).map((d) => d.label),
    [selectedDates],
  );

  const summaryPrograms = useMemo(
    () => PROGRAM_OPTIONS.filter((p) => selectedPrograms.has(p.id)).map((p) => p.label),
    [selectedPrograms],
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        dateIds: [...selectedDates],
        programs: [...selectedPrograms],
        attendance,
        note: note.trim(),
        submittedAt: new Date().toISOString(),
      };
      const agg = await submitVote(payload);
      setAggregate(agg);
      setStep('success');
    } catch {
      setError('제출에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const attendanceLabel = (a: AttendanceStatus) => {
    if (a === 'yes') return '참석 가능';
    if (a === 'maybe') return '아마 참석';
    if (a === 'no') return '어려움';
    return '—';
  };

  return (
    <section className="scene-voting" aria-label="THE QUEEN VOTING">
      <header className="scene-voting__header">
        <h1>QUEEN&apos;S SCHEDULE VOTE</h1>
        <p className="scene-voting__tagline">퀸들의 일정을 분석하고 있습니다.</p>
        <p className="scene-voting__sub">
          여러분의 선택이 GNGN의 미래를 결정합니다. 아마도.
        </p>
        <p className="scene-voting__ai">
          AI가 날짜를 예측하고 있습니다. 단, 최종 결정은 인간이 합니다.
        </p>
        <p className="scene-voting__deadline">
          투표 마감: {formatVoteDeadline()}
          {closed && <strong className="scene-voting__closed"> (마감됨)</strong>}
        </p>
      </header>

      {step === 'form' && (
        <>
          <fieldset className="vote-block" disabled={closed}>
            <legend>날짜 후보 (복수 선택)</legend>
            {VOTE_MONTH_GROUPS.map((group) => (
              <div key={group.key} className="vote-month">
                <h3>{group.label}</h3>
                <ul className="vote-chips">
                  {VOTE_DATE_OPTIONS.filter((d) => d.monthKey === group.key).map((d) => {
                    const selected = selectedDates.has(d.id);
                    const count = aggregate?.dateCounts[d.id] ?? 0;
                    return (
                      <li key={d.id}>
                        <button
                          type="button"
                          className={`vote-chip ${selected ? 'is-selected' : ''}`}
                          onClick={() => toggleDate(d.id)}
                          aria-pressed={selected}
                        >
                          <span>{d.label.replace(/ \(토\)$/, '')}</span>
                          <span className="vote-chip__count" aria-label={`현재 ${count}표`}>
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </fieldset>

          <fieldset className="vote-block" disabled={closed}>
            <legend>참석 가능 여부</legend>
            <div className="vote-radio-row">
              {(
                [
                  ['yes', '참석 가능'],
                  ['maybe', '아마 참석'],
                  ['no', '어려움'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="vote-radio">
                  <input
                    type="radio"
                    name="attendance"
                    value={value}
                    checked={attendance === value}
                    onChange={() => setAttendance(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
            <label className="vote-note">
              <span>메모 (선택)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="예: 2차는 어려울 수 있어요"
                rows={2}
              />
            </label>
          </fieldset>

          <fieldset className="vote-block" disabled={closed}>
            <legend>프로그램 선호 (복수 선택)</legend>
            <ul className="vote-checklist">
              {PROGRAM_OPTIONS.map((p) => {
                const selected = selectedPrograms.has(p.id);
                const count = aggregate?.programCounts[p.id] ?? 0;
                return (
                  <li key={p.id}>
                    <label className={`vote-check ${selected ? 'is-selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleProgram(p.id)}
                      />
                      <span>{p.label}</span>
                      <span className="vote-check__count">{count}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <GngnButton
            disabled={!canProceedConfirm || closed}
            onClick={() => setStep('confirm')}
          >
            선택 내용 확인하기
          </GngnButton>
        </>
      )}

      {step === 'confirm' && (
        <div className="vote-confirm">
          <h2>제출 전 확인</h2>
          <dl>
            <div>
              <dt>선택한 날짜</dt>
              <dd>
                <ul>{summaryDates.map((d) => <li key={d}>{d}</li>)}</ul>
              </dd>
            </div>
            <div>
              <dt>참석 가능 여부</dt>
              <dd>{attendanceLabel(attendance)}</dd>
            </div>
            {note.trim() && (
              <div>
                <dt>메모</dt>
                <dd>{note.trim()}</dd>
              </div>
            )}
            <div>
              <dt>프로그램</dt>
              <dd>
                <ul>{summaryPrograms.map((p) => <li key={p}>{p}</li>)}</ul>
              </dd>
            </div>
          </dl>
          {error && <p className="vote-error" role="alert">{error}</p>}
          <div className="vote-confirm__actions">
            <GngnButton variant="dark" onClick={() => setStep('form')}>
              수정하기
            </GngnButton>
            <GngnButton disabled={submitting} onClick={() => void handleSubmit()}>
              {submitting ? '제출 중…' : '투표 제출'}
            </GngnButton>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="vote-success">
          <img src={IMAGES.thumbsUpCat} alt="" className="vote-success__img" />
          <h2>투표 제출 완료</h2>
          <p>퀸들의 선택이 기록되었습니다. (브라우저·API 설정에 따라 집계 방식이 달라질 수 있습니다.)</p>
          {aggregate && (
            <p className="vote-success__meta">
              현재 참여 인원(집계): <strong>{aggregate.participantCount}</strong>
            </p>
          )}
          <GngnButton variant="pink" onClick={onComplete}>
            비밀 집회 입구로
          </GngnButton>
        </div>
      )}

      {aggregate && step === 'form' && (
        <aside className="vote-tally" aria-label="투표 현황">
          <h2>투표 현황</h2>
          <p>참여 인원: {aggregate.participantCount}</p>
        </aside>
      )}
    </section>
  );
}
