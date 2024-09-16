/// <reference types="vite/client" />
// env.d.ts
interface ImportMetaEnv {
  VITE_API_URL: string
  VITE_PORT?: number
  // Thêm các biến môi trường khác ở đây
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
