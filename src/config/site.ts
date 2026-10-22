export const siteConfig = {
  eventName: 'GNGN — GN Girls Night',
  kakaoOpenChatUrl: import.meta.env.VITE_KAKAO_OPEN_CHAT_URL?.trim() || '',
} as const;
