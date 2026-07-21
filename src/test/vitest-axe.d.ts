import type { AxeMatchers } from 'vitest-axe/matchers';

// vitest-axe ships type augmentation for the legacy `Vi` global namespace
// only; Vitest 3 resolves matcher types from the `vitest` module instead.
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface Assertion<T = unknown> extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
