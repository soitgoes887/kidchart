/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SAVE_URL: string;
  readonly VITE_LOAD_URL: string;
  readonly VITE_SHARE_URL_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
