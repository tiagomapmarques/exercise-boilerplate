/** biome-ignore-all lint/style/noRestrictedImports: Sub-module imports intentional */
import { act as baseAct } from '@testing-library/react';

/** `@testing-library/react`'s `act` with a single signature, so the linter does not wrongly flag awaiting its result. */
export const act: <Result>(scope: () => Result) => Result = baseAct;
