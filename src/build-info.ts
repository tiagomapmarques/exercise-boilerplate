// biome-ignore lint/style/noRestrictedImports: Single point of access for package.json metadata
export { license, name, version } from '../package.json' with { type: 'json' };
