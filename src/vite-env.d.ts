/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_OPEN_CHAT_URL?: string;
  readonly VITE_VOTE_DEADLINE?: string;
  readonly VITE_VOTES_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
