// Add `.env` types to `import.meta.env` for type-safety
declare interface ImportMetaEnv {
  VITE_API_KEY?: string;
}

// Add ".po" file imports
declare module '*.po' {
  export const messages: import('@lingui/core').Messages;
}
