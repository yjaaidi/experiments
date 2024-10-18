import { type PluginObj } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';

export default declare((api) => {
  api.assertVersion(7);

  return {
    name: 'playwright-run-in-browser',
    visitor: {
    },
  } satisfies PluginObj;
});
