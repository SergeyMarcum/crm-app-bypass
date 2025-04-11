/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEST_MODE: string;
  // Если у вас есть другие переменные окружения, добавьте их сюда
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
