import { describe, expect, it } from 'vitest';
import { updateRegion } from './update-region';

describe(updateRegion.name, () => {
  it('creates region and keeps content', () => {
    const fileContent = 'export const result = 42;';

    const content = updateRegion({
      fileContent,
      region: 'my-test.spec.ts',
      regionContent: `globalThis.myTest = () => console.log('my test');`,
    });

    expect(content).toBe(`\
export const result = 42;
// #region my-test.spec.ts
globalThis.myTest = () => console.log('my test');
// #endregion
`);
  });

  it('replaces region', () => {
    const fileContent = `\
// #region my-old.spec.ts
globalThis.myOldTest = () => console.log('my old test');
// #endregion
// #region my-test.spec.ts
globalThis.myTest = () => console.log('❌ my test ❌');
// #endregion
// #region my-other.spec.ts
globalThis.myOtherTest = () => console.log('my other test');
// #endregion
`;

    const content = updateRegion({
      fileContent,
      region: 'my-test.spec.ts',
      regionContent: `globalThis.myUpdatedTest = () => console.log('✨my UPDATED test ✨');`,
    });

    expect(content).toBe(`\
// #region my-old.spec.ts
globalThis.myOldTest = () => console.log('my old test');
// #endregion
// #region my-other.spec.ts
globalThis.myOtherTest = () => console.log('my other test');
// #endregion
// #region my-test.spec.ts
globalThis.myUpdatedTest = () => console.log('✨my UPDATED test ✨');
// #endregion
`);
  });
});
