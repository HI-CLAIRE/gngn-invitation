/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_OPEN_CHAT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
