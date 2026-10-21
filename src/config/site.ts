export const siteConfig = {
  eventName: 'GNGN — GN Girls Night',
  kakaoOpenChatUrl: import.meta.env.VITE_KAKAO_OPEN_CHAT_URL?.trim() || '',
  voteDeadline: import.meta.env.VITE_VOTE_DEADLINE?.trim() || '2026-10-31T23:59:59+09:00',
  votesApiUrl: import.meta.env.VITE_VOTES_API_URL?.trim() || '',
} as const;

export function isVoteClosed(now = new Date()): boolean {
  const deadline = new Date(siteConfig.voteDeadline);
  if (Number.isNaN(deadline.getTime())) return false;
  return now > deadline;
}

export function formatVoteDeadline(locale = 'ko-KR'): string {
  const deadline = new Date(siteConfig.voteDeadline);
  if (Number.isNaN(deadline.getTime())) return siteConfig.voteDeadline;
  return deadline.toLocaleString(locale, {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}
