import type { PluginObj } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';

export default declare(({ assertVersion, types: t }) => {
  assertVersion(7);

  return {
    name: 'transform-angular',
    visitor: {
      Program() {
        throw new Error('🚧 work in progress');
      },
    },
  } satisfies PluginObj;
});
