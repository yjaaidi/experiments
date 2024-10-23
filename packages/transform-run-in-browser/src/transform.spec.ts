import { PluginItem, transformSync } from '@babel/core';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import transformRunInBrowser, { TestingOptions } from './transform';
import { FileRepositoryFake } from './file-repository.fake';

describe('test transform', () => {
  test('remove imports used in `runInBrowser` only', () => {
    const { transform } = setUp();
    const result = transform(RECIPE_SEARCH_TEST);
    expect
      .soft(result)
      .not.toContain(`import { TestBed } from '@angular/core/testing';`);
    expect
      .soft(result)
      .not.toContain(
        `import { RecipeSearchComponent } from './recipe-search.component';`,
      );
  });

  test('keep imports that are used outside `runInBrowser`', () => {
    const { transform } = setUp();

    const result = transform(RECIPE_SEARCH_TEST);

    expect(result).toContain(
      `import { expect, test } from '@playwright/test';`,
    );
  });

  test('replace `runInBrowser` function argument with a function identifier', () => {
    const { transform } = setUp();

    const result = transform(RECIPE_SEARCH_TEST);

    expect(result).toMatch(
      /await runInBrowser\("src_recipe_search_spec_ts_mPLWHe"\)/,
    );
  });

  test.todo(
    'remove specifiers that are used in `runInBrowser` but keep those used outside',
  );
});

describe('code extraction', () => {
  test('extract imports', () => {
    const { transform, readRelativeFile } = setUp();

    transform(RECIPE_SEARCH_TEST);

    expect(readRelativeFile('playwright/generated/src/recipe-search.spec.ts'))
      .toContain(`\
import { TestBed } from "@angular/core/testing";
import { RecipeSearchComponent } from "../../../src/recipe-search.component";
`);
  });

  test('extract imports without duplicates', () => {
    const { transform, readRelativeFile } = setUp();

    transform({
      relativeFilePath: 'src/recipe-search.spec.ts',
      code: `\
import { a } from './a';
import { unused } from './unused';

test('...', async ({page, expect}) => {
  unused();

  await runInBrowser(async () => {
    a();
  });
});

test('...', async ({page, expect}) => {
  unused();

  await runInBrowser(async () => {
    console.log(a);
  });
});
      `,
    });

    expect(readRelativeFile('playwright/generated/src/recipe-search.spec.ts'))
      .toContain(`\
import { a } from "../../../src/a";
`);
  });

  test('extract `runInBrowser` call', () => {
    const { transform, readRelativeFile } = setUp();

    transform(RECIPE_SEARCH_TEST);

    expect.soft(readRelativeFile('playwright/generated/index.ts')).toContain(`
// #region src/recipe-search.spec.ts
(globalThis as any).src_recipe_search_spec_ts_mPLWHe = async () => {
  const { src_recipe_search_spec_ts_mPLWHe } = await import('./src/recipe-search.spec');
  return src_recipe_search_spec_ts_mPLWHe();
};
// #endregion`);
    expect.soft(
      readRelativeFile('playwright/generated/src/recipe-search.spec.ts'),
    ).toContain(`export const src_recipe_search_spec_ts_mPLWHe = async () => {
  TestBed.createComponent(RecipeSearchComponent);
}`);
  });

  test('extract identical `runInBrowser` calls once', () => {
    const { transform, readRelativeFile } = setUp();

    transform({
      relativeFilePath: 'src/recipe-search.spec.ts',
      code: `
      await runInBrowser(async () => {
        console.log('IDENTICAL_CALL');
      });

      await runInBrowser(async () => {
        console.log('IDENTICAL_CALL');
      });
      `,
    });

    expect.soft(readRelativeFile('playwright/generated/index.ts')).toContain(`\
// #region src/recipe-search.spec.ts
(globalThis as any).src_recipe_search_spec_ts_kayOHk = async () => {
  const { src_recipe_search_spec_ts_kayOHk } = await import('./src/recipe-search.spec');
  return src_recipe_search_spec_ts_kayOHk();
};
// #endregion
`);
    expect.soft(
      readRelativeFile('playwright/generated/src/recipe-search.spec.ts'),
    ).toBe(`\
export const src_recipe_search_spec_ts_kayOHk = async () => {
  console.log('IDENTICAL_CALL');
};`);
  });

  test('fix async import path in `runInBrowser` call', () => {
    const { transform, readRelativeFile } = setUp();

    transform({
      relativeFilePath: 'src/recipe-search.spec.ts',
      code: `\
      await runInBrowser(async () => {
        const { TestBed } = await import('@angular/core/testing');
        const { RecipeSearchComponent } = await import('./recipe-search.component');
      });
      `,
    });

    expect.soft(
      readRelativeFile('playwright/generated/src/recipe-search.spec.ts'),
    ).toContain(` = async () => {
  const {
    TestBed
  } = await import('@angular/core/testing');
  const {
    RecipeSearchComponent
  } = await import("../../../src/recipe-search.component");
};`);
  });

  test('add export statement in generated/index.ts to make it a valid ESM module', () => {
    const { transform, readRelativeFile } = setUp();

    transform(RECIPE_SEARCH_TEST);

    expect
      .soft(readRelativeFile('playwright/generated/index.ts'))
      .toContain(`export {};`);
  });

  test('update entry points in generated/index.ts without breaking existing regions', async () => {
    const { transform, readRelativeFile, writeRelativeFile } = setUp();

    await writeRelativeFile(
      'playwright/generated/index.ts',
      `
// #region src/another-file.spec.ts
globalThis.anotherExtractedFunction = async () => {
  console.log('another');
});
// #endregion
// #region src/recipe-search.spec.ts
globalThis.oldExtractedFuntion = async () => {
  console.log('old');
};
// #endregion
// #region src/yet-another-file.spec.ts
globalThis.yetAnotherExtractedFunction = async () => {
  console.log('yet another');
});
// #endregion
`,
    );

    transform(RECIPE_SEARCH_TEST);

    const content = readRelativeFile('playwright/generated/index.ts');
    expect.soft(content).toContain(`\
// #region src/another-file.spec.ts
globalThis.anotherExtractedFunction = async () => {
  console.log('another');
});
// #endregion
`);
    expect.soft(content).toContain(`\
// #region src/yet-another-file.spec.ts
globalThis.yetAnotherExtractedFunction = async () => {
  console.log('yet another');
});
// #endregion
`);
    expect.soft(content).not.toContain('oldExtractedFuntion');
  });

  test('reset context between files', () => {
    const { transform, readRelativeFile } = setUp();

    transform(RECIPE_SEARCH_TEST);

    transform({
      relativeFilePath: 'src/another-file.spec.ts',
      code: `
    await runInBrowser(async () => {
      console.log('another-file');
    });
    `,
    });

    const content = readRelativeFile(
      'playwright/generated/src/another-file.spec.ts',
    );
    expect.soft(content).toContain(`console.log('another-file');`);
    expect.soft(content).not.toContain(`RecipeSearchComponent`);
  });

  test('do not create empty file when no `runInBrowser` is extracted', () => {
    const { transform, readRelativeFile } = setUp();

    transform({
      relativeFilePath: 'src/no-run-in-browser.spec.ts',
      code: `
    test('...', async ({page, expect}) => {
      expect(true).toBe(true);
    })
    `,
    });

    expect(
      readRelativeFile('playwright/generated/src/no-run-in-browser.spec.ts'),
    ).toBeNull();
  });
});

const RECIPE_SEARCH_TEST = {
  relativeFilePath: 'src/recipe-search.spec.ts',
  code: `
import { TestBed } from '@angular/core/testing';
import { expect, test } from '@playwright/test';
import { RecipeSearchComponent } from './recipe-search.component';

test('...', async ({page, expect, runInBrowser}) => {
  await runInBrowser(async () => {
    TestBed.createComponent(RecipeSearchComponent);
  });

  await expect(page.getByRole('listitem')).toHaveText(['Burger', 'Salad']);
});
`,
};

function setUp() {
  const projectRoot = '/path/to/project';
  const fileRepository = new FileRepositoryFake();

  /* Keep this here to reuse the same plugin instance when multiple files are transformed
   * to make sure the context is reset properly.
   * Cf. "reset context between files" test */
  const plugin: PluginItem = [
    transformRunInBrowser,
    {
      projectRoot,
      fileRepository,
    } as TestingOptions,
  ];

  return {
    readRelativeFile(relativeFilePath: string) {
      return fileRepository.tryReadFile(join(projectRoot, relativeFilePath));
    },
    async writeRelativeFile(relativeFilePath: string, content: string) {
      await fileRepository.writeFile(
        join(projectRoot, relativeFilePath),
        content,
      );
    },
    transform({
      relativeFilePath,
      code,
    }: {
      relativeFilePath: string;
      code: string;
    }) {
      return transformSync(code, {
        filename: join(projectRoot, relativeFilePath),
        plugins: [plugin],
      })?.code;
    },
  };
}
