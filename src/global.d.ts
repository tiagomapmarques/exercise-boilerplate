// Add `.env` types to `import.meta.env` for type-safety
// biome-ignore lint/nursery/useConsistentTypeDefinitions: Necessary for it to work
declare interface ImportMetaEnv {
  readonly VITE_API_KEY?: string;
}

// Add ".po" file imports
declare module '*.po' {
  export const messages: import('@lingui/core').Messages;
}
