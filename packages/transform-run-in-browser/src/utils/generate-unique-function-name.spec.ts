import { describe, expect, it } from 'vitest';
import { generateUniqueFunctionName } from './generate-unique-function-name';

describe(generateUniqueFunctionName.name, () => {
  it('does not contain /', () => {
    const name = generateUniqueFunctionName({
      path: 'my-file.spec.ts',
      code: `() => { console.log('Heyyyyyyyyy!'); }`,
    });
    /*                      instead of pr8/qQ */
    expect(name).toBe('my_file_spec_ts_pr8_qQ');
  });

  it('does not contain -', () => {
    const name = generateUniqueFunctionName({
      path: 'my-file.spec.ts',
      code: `() => { console.log('Heyyyyyyyyyyyyyyyyy!'); }`,
    });

    /*                      instead of ZKd9-A */
    expect(name).toBe('my_file_spec_ts_ZKd9_A');
  });
});
