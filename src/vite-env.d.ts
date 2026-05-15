/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_TIME: string;
  readonly VITE_COMMIT_HASH: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
