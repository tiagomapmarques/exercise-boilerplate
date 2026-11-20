// biome-ignore lint/style/useConsistentTypeDefinitions: Required by Vite for ImportMetaEnv augmentation
declare interface ImportMetaEnv {
  /** Path the app is served under (optional). */
  readonly VITE_BASE_PATH?: string;
}

declare module '*.po' {
  export const messages: import('@lingui/core').Messages;
}
