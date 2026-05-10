// Add `.env` types to `import.meta.env` for type-safety
// biome-ignore lint/style/useConsistentTypeDefinitions: Required by Vite for ImportMetaEnv augmentation
declare interface ImportMetaEnv {
  // Example environment variable - replace or extend with your own VITE_* keys
  readonly VITE_API_KEY?: string;
}

// Add ".po" file imports
declare module '*.po' {
  export const messages: import('@lingui/core').Messages;
}
