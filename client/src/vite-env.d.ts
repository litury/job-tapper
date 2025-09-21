/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string
  readonly VITE_HH_CLIENT_ID: string
  readonly VITE_HH_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
