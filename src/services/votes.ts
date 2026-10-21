import { siteConfig } from '../config/site';
import type { ProgramId } from '../config/voteDates';
import { VOTE_DATE_OPTIONS, PROGRAM_OPTIONS } from '../config/voteDates';

const STORAGE_AGGREGATE = 'gngn-vote-aggregate-v1';
const STORAGE_USER = 'gngn-vote-user-v1';

export type AttendanceStatus = 'yes' | 'maybe' | 'no' | '';

export type UserVotePayload = {
  dateIds: string[];
  programs: ProgramId[];
  attendance: AttendanceStatus;
  note: string;
  submittedAt: string;
};

export type VoteAggregate = {
  dateCounts: Record<string, number>;
  programCounts: Record<string, number>;
  participantCount: number;
};

function emptyAggregate(): VoteAggregate {
  const dateCounts: Record<string, number> = {};
  for (const d of VOTE_DATE_OPTIONS) dateCounts[d.id] = 0;
  const programCounts: Record<string, number> = {};
  for (const p of PROGRAM_OPTIONS) programCounts[p.id] = 0;
  return { dateCounts, programCounts, participantCount: 0 };
}

function readAggregate(): VoteAggregate {
  try {
    const raw = localStorage.getItem(STORAGE_AGGREGATE);
    if (!raw) return emptyAggregate();
    const parsed = JSON.parse(raw) as VoteAggregate;
    const base = emptyAggregate();
    return {
      dateCounts: { ...base.dateCounts, ...parsed.dateCounts },
      programCounts: { ...base.programCounts, ...parsed.programCounts },
      participantCount: parsed.participantCount ?? 0,
    };
  } catch {
    return emptyAggregate();
  }
}

function writeAggregate(agg: VoteAggregate) {
  localStorage.setItem(STORAGE_AGGREGATE, JSON.stringify(agg));
}

export function getUserVote(): UserVotePayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    if (!raw) return null;
    return JSON.parse(raw) as UserVotePayload;
  } catch {
    return null;
  }
}

export async function fetchVoteAggregate(): Promise<VoteAggregate> {
  const url = siteConfig.votesApiUrl;
  if (url) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        const data = (await res.json()) as VoteAggregate;
        const base = emptyAggregate();
        return {
          dateCounts: { ...base.dateCounts, ...data.dateCounts },
          programCounts: { ...base.programCounts, ...data.programCounts },
          participantCount: data.participantCount ?? 0,
        };
      }
    } catch {
      /* fallback local */
    }
  }
  return readAggregate();
}

export async function submitVote(payload: UserVotePayload): Promise<VoteAggregate> {
  const url = siteConfig.votesApiUrl;
  if (url) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        localStorage.setItem(STORAGE_USER, JSON.stringify(payload));
        return fetchVoteAggregate();
      }
    } catch {
      /* fallback local */
    }
  }

  const prev = readAggregate();
  const next = { ...prev, dateCounts: { ...prev.dateCounts }, programCounts: { ...prev.programCounts } };
  const hadPrevious = Boolean(getUserVote());

  if (!hadPrevious) {
    next.participantCount += 1;
  }

  for (const id of payload.dateIds) {
    if (id in next.dateCounts) next.dateCounts[id] += 1;
  }
  for (const id of payload.programs) {
    if (id in next.programCounts) next.programCounts[id] += 1;
  }

  writeAggregate(next);
  localStorage.setItem(STORAGE_USER, JSON.stringify(payload));
  return next;
}
