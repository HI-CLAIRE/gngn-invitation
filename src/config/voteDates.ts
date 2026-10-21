export type VoteDateOption = {
  id: string;
  label: string;
  monthKey: string;
  monthLabel: string;
};

const months: { key: string; label: string; dates: { day: number; year: number; month: number }[] }[] = [
  {
    key: '2026-11',
    label: '2026년 11월',
    dates: [
      { year: 2026, month: 11, day: 7 },
      { year: 2026, month: 11, day: 14 },
      { year: 2026, month: 11, day: 21 },
      { year: 2026, month: 11, day: 28 },
    ],
  },
  {
    key: '2026-12',
    label: '2026년 12월',
    dates: [
      { year: 2026, month: 12, day: 5 },
      { year: 2026, month: 12, day: 12 },
      { year: 2026, month: 12, day: 19 },
      { year: 2026, month: 12, day: 26 },
    ],
  },
  {
    key: '2027-01',
    label: '2027년 1월',
    dates: [
      { year: 2027, month: 1, day: 2 },
      { year: 2027, month: 1, day: 9 },
      { year: 2027, month: 1, day: 16 },
      { year: 2027, month: 1, day: 23 },
      { year: 2027, month: 1, day: 30 },
    ],
  },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export const VOTE_DATE_OPTIONS: VoteDateOption[] = months.flatMap((m) =>
  m.dates.map((d) => {
    const id = `${d.year}-${pad(d.month)}-${pad(d.day)}`;
    return {
      id,
      label: `${d.year}년 ${d.month}월 ${d.day}일 (토)`,
      monthKey: m.key,
      monthLabel: m.label,
    };
  }),
);

export const VOTE_MONTH_GROUPS = months.map((m) => ({
  key: m.key,
  label: m.label,
  dateIds: m.dates.map((d) => `${d.year}-${pad(d.month)}-${pad(d.day)}`),
}));

export const PROGRAM_OPTIONS = [
  { id: 'mafia', label: '마피아 게임' },
  { id: 'manito', label: '마니또' },
  { id: 'anonymous-queen', label: '오픈 카톡에서 익명 퀸 찾기' },
  { id: 'gift-exchange', label: '랜덤 선물 교환' },
  { id: 'talk', label: '근황 토크 및 썰 풀기' },
  { id: 'boardgame', label: '보드게임' },
  { id: 'afterparty', label: '2차까지 불태우기' },
] as const;

export type ProgramId = (typeof PROGRAM_OPTIONS)[number]['id'];
